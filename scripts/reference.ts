/**
 * Reads the design of a public website as numbers and files them beside
 * screenshots, so the reference skill can write the site's design system
 * and map it onto the four knobs in DESIGN.md. Structure only: computed
 * styles, fonts, colours, hairlines, radii, spacing, widths, breakpoints,
 * the chrome, cards, controls and motion. It saves no copy and no images
 * from the site, and the screenshots are the record of what was looked at,
 * not assets.
 *
 *   pnpm design:reference https://example.com [--name example]
 *
 * Writes docs/design/explorations/references/<date>-<name>/ holding six
 * WebP screenshots and data.json with one block per run: desktop, tablet
 * and phone in light, desktop and phone in dark. Light and dark come from
 * prefers-color-scheme. A site with its own toggle shows its light scheme
 * twice, and darkFollowsSystem says so.
 */
import { chromium, type Browser, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Count = Record<string, number>;

interface Raw {
  title: string;
  lang: string;
  colorScheme: string;
  themeColor: string | null;
  root: { fontSize: string; lineHeight: string; background: string; color: string };
  fonts: Record<string, { chars: number; weights: Count; sizes: Count }>;
  faces: string[];
  styles: Record<string, { chars: number; tags: Count; sample: string }>;
  headings: Record<string, { family: string; size: string; weight: string; lineHeight: string; letterSpacing: string; count: number; sample: string }>;
  backgrounds: Count;
  text: Count;
  borders: Count;
  rings: Count;
  drops: Count;
  gradients: Count;
  radii: Count;
  spacing: Count;
  sections: Count;
  widths: Count;
  breakpoints: Count;
  header: { tag: string; height: number; background: string; position: string; blur: boolean } | null;
  footer: { background: string; paddingTop: string; paddingBottom: string; columns: number } | null;
  cards: Record<string, { count: number; sample: string }>;
  inputs: Record<string, { count: number }>;
  controls: Record<string, { count: number; sample: string }>;
  motion: Count;
  tokens: Record<string, string>;
  semanticTokens: Record<string, string>;
  tokenCount: number;
  elements: number;
  scrollHeight: number;
}

const viewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
} as const;
const fullPageCap = 6000;

// Runs inside the page. Everything it needs is in scope here, because
// Playwright serialises the function and nothing outside it travels.
function readPage(): Raw {
  const bump = (map: Count, key: string, by = 1) => {
    map[key] = (map[key] ?? 0) + by;
  };

  // Modern sites compute to lab(), oklch() or color(), which no one reads.
  // Painting the colour onto one pixel and reading it back gives 8 bit sRGB
  // for any syntax the browser knows, with wide gamut clipped to sRGB.
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const paint = canvas.getContext("2d", { willReadFrequently: true });
  const cache = new Map<string, string>();
  const colour = (value: string) => {
    if (!paint) return value;
    let out = cache.get(value);
    if (out === undefined) {
      paint.clearRect(0, 0, 1, 1);
      paint.fillStyle = value;
      paint.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = paint.getImageData(0, 0, 1, 1).data;
      out = a === 0 ? "transparent" : a === 255 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
      cache.set(value, out);
    }
    return out;
  };

  const rootEl = document.documentElement;
  const rootStyle = getComputedStyle(rootEl);
  const bodyStyle = getComputedStyle(document.body);
  const raw: Raw = {
    title: document.title,
    lang: rootEl.lang,
    colorScheme: rootStyle.colorScheme,
    themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content") ?? null,
    root: { fontSize: rootStyle.fontSize, lineHeight: bodyStyle.lineHeight, background: colour(bodyStyle.backgroundColor), color: colour(bodyStyle.color) },
    fonts: {},
    faces: [],
    styles: {},
    headings: {},
    backgrounds: {},
    text: {},
    borders: {},
    rings: {},
    drops: {},
    gradients: {},
    radii: {},
    spacing: {},
    sections: {},
    widths: {},
    breakpoints: {},
    header: null,
    footer: null,
    cards: {},
    inputs: {},
    controls: {},
    motion: {},
    tokens: {},
    semanticTokens: {},
    tokenCount: 0,
    elements: 0,
    scrollHeight: rootEl.scrollHeight,
  };

  for (const face of Array.from(document.fonts)) {
    if (face.status === "loaded") raw.faces.push(`${face.family.replace(/"/g, "")} ${face.weight} ${face.style}`);
  }

  // Custom properties on :root, html or body, and the widths media queries
  // switch on, from every readable sheet. Cross origin sheets throw on
  // cssRules and are skipped, so a site served from a CDN may show none.
  const names = new Set<string>();
  const rootSelector = /^(:root|html|body)(\b|[[.:])/;
  const width = /\((?:min|max)-width:\s*([\d.]+)(px|em|rem)\)/g;
  const visit = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        if (rootSelector.test(rule.selectorText)) {
          for (const name of Array.from(rule.style)) if (name.startsWith("--")) names.add(name);
        }
      } else if (rule instanceof CSSMediaRule) {
        for (const match of rule.media.mediaText.matchAll(width)) {
          bump(raw.breakpoints, String(Math.round(Number(match[1]) * (match[2] === "px" ? 1 : 16))));
        }
        visit(rule.cssRules);
      } else if ("cssRules" in rule) {
        visit((rule as CSSGroupingRule).cssRules);
      }
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      visit(sheet.cssRules);
    } catch {
      continue;
    }
  }
  raw.tokenCount = names.size;
  const sorted = Array.from(names).sort();
  for (const name of sorted.slice(0, 300)) raw.tokens[name] = rootStyle.getPropertyValue(name).trim();
  for (const name of sorted) {
    if (/error|success|warn|danger|info|positive|negative|destructive/i.test(name)) raw.semanticTokens[name] = rootStyle.getPropertyValue(name).trim();
  }

  // Computed box-shadow is "colour x y blur spread [inset], ...". A layer
  // with no blur and a one pixel spread is a hairline drawn as a ring, which
  // is how a design system without borders draws its borders.
  const layer = /(rgba?\([^)]*\)|#[0-9a-f]+|[a-z]+\([^)]*\)|[a-z]+) (-?[\d.]+)px (-?[\d.]+)px (-?[\d.]+)px(?: (-?[\d.]+)px)?( inset)?/g;
  const shadows = (value: string) => {
    for (const match of value.matchAll(layer)) {
      const tone = colour(match[1]);
      if (tone === "transparent") continue;
      const blur = Number(match[4]);
      const spread = Number(match[5] ?? 0);
      if (blur === 0 && Math.abs(spread) === 1) bump(raw.rings, `${tone}${match[6] ? " inset" : ""}`);
      else bump(raw.drops, `${tone} ${match[2]} ${match[3]} ${match[4]}${match[5] ? ` ${match[5]}` : ""}${match[6] ?? ""}`);
    }
  };

  const chrome = document.querySelector("header, [role='banner'], nav");
  if (chrome instanceof HTMLElement) {
    const cs = getComputedStyle(chrome);
    raw.header = {
      tag: chrome.tagName.toLowerCase(),
      height: Math.round(chrome.getBoundingClientRect().height),
      background: colour(cs.backgroundColor),
      position: cs.position,
      blur: cs.backdropFilter !== "none",
    };
  }
  const foot = document.querySelector("footer, [role='contentinfo']");
  if (foot instanceof HTMLElement) {
    const cs = getComputedStyle(foot);
    let columns = 0;
    for (const el of Array.from(foot.querySelectorAll("*"))) {
      const grid = getComputedStyle(el);
      if (grid.display === "grid") columns = Math.max(columns, grid.gridTemplateColumns.split(" ").length);
    }
    raw.footer = { background: colour(cs.backgroundColor), paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, columns };
  }

  const transparent = /^rgba\(\d+, \d+, \d+, 0\)$/;
  let seen = 0;
  for (const el of Array.from(document.querySelectorAll("body *"))) {
    if (seen >= 8000) break;
    if (!(el instanceof HTMLElement || el instanceof SVGSVGElement)) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;
    seen++;
    const area = rect.width * rect.height;
    const tag = el.tagName.toLowerCase();

    const own = Array.from(el.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => (node.textContent ?? "").trim())
      .join(" ");
    const family = cs.fontFamily.split(",")[0].trim().replace(/^["']|["']$/g, "");
    const size = String(Math.round(parseFloat(cs.fontSize)));
    if (own.length > 0) {
      const font = (raw.fonts[family] ??= { chars: 0, weights: {}, sizes: {} });
      font.chars += own.length;
      bump(font.weights, cs.fontWeight, own.length);
      bump(font.sizes, size, own.length);
      bump(raw.text, colour(cs.color), own.length);
      const key = [family, size, cs.fontWeight, cs.lineHeight, cs.letterSpacing].join("|");
      const style = (raw.styles[key] ??= { chars: 0, tags: {}, sample: own.slice(0, 40) });
      style.chars += own.length;
      bump(style.tags, tag);
    }
    if (/^h[1-6]$/.test(tag)) {
      const heading = (raw.headings[tag] ??= {
        family,
        size,
        weight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        count: 0,
        sample: (el.textContent ?? "").trim().slice(0, 40),
      });
      heading.count++;
    }

    const background = colour(cs.backgroundColor);
    if (background !== "transparent" && !transparent.test(background)) bump(raw.backgrounds, background, area);
    if (cs.backgroundImage !== "none" && /gradient/.test(cs.backgroundImage)) bump(raw.gradients, cs.backgroundImage.slice(0, 120));

    const sides = [
      [cs.borderTopWidth, cs.borderTopStyle, cs.borderTopColor],
      [cs.borderRightWidth, cs.borderRightStyle, cs.borderRightColor],
      [cs.borderBottomWidth, cs.borderBottomStyle, cs.borderBottomColor],
      [cs.borderLeftWidth, cs.borderLeftStyle, cs.borderLeftColor],
    ].filter(([w, style]) => parseFloat(w) > 0 && style !== "none" && style !== "hidden");
    const border = sides.length > 0 ? `${sides[0][0]} ${colour(sides[0][2])}` : "none";
    if (sides.length > 0) bump(raw.borders, colour(sides[0][2]));
    if (cs.borderRadius !== "0px") bump(raw.radii, cs.borderRadius);
    if (cs.boxShadow !== "none") shadows(cs.boxShadow);
    const ring = cs.boxShadow !== "none" && /0px 0px 0px 1px/.test(cs.boxShadow);

    for (const value of [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft, cs.marginTop, cs.marginBottom, cs.rowGap, cs.columnGap]) {
      const px = Math.round(parseFloat(value));
      if (px > 0 && px <= 320) bump(raw.spacing, String(px));
    }
    if (rect.width >= innerWidth * 0.6) {
      for (const value of [cs.paddingTop, cs.paddingBottom]) {
        const px = Math.round(parseFloat(value));
        if (px >= 32) bump(raw.sections, String(px));
      }
    }
    const maxWidth = parseFloat(cs.maxWidth);
    if (maxWidth >= 480 && maxWidth <= innerWidth) bump(raw.widths, String(Math.round(maxWidth)));

    for (const duration of cs.transitionDuration.split(",")) {
      const value = duration.trim();
      if (value !== "0s") bump(raw.motion, value);
    }

    const isControl = el.matches("a, button, [role='button'], input, select, textarea");
    if (isControl) {
      const signature = JSON.stringify({
        tag,
        background,
        color: colour(cs.color),
        radius: cs.borderRadius,
        weight: cs.fontWeight,
        size: cs.fontSize,
        height: Math.round(rect.height),
        padding: cs.padding,
        border,
        ring,
        shadow: cs.boxShadow !== "none" && !ring,
      });
      const control = (raw.controls[signature] ??= { count: 0, sample: (el.textContent ?? "").trim().slice(0, 40) });
      control.count++;
    }
    if (el.matches("input:not([type='hidden']):not([type='checkbox']):not([type='radio']), textarea, select")) {
      const signature = JSON.stringify({
        tag,
        background,
        color: colour(cs.color),
        radius: cs.borderRadius,
        size: cs.fontSize,
        height: Math.round(rect.height),
        padding: cs.padding,
        border,
        ring,
      });
      (raw.inputs[signature] ??= { count: 0 }).count++;
    }
    if (!isControl && area >= 20000 && rect.width < innerWidth * 0.9 && cs.borderRadius !== "0px" && (background !== "transparent" || border !== "none" || ring)) {
      const signature = JSON.stringify({ background, radius: cs.borderRadius, border, ring, padding: cs.padding });
      const card = (raw.cards[signature] ??= { count: 0, sample: (el.textContent ?? "").trim().slice(0, 40) });
      card.count++;
    }
  }
  raw.elements = seen;
  return raw;
}

// Node side. Turns the raw counts into short sorted lists a person can read.

function hex(value: string): string {
  const match = value.match(/^rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)$/);
  if (!match) return value;
  const channel = (n: string) => Number(n).toString(16).padStart(2, "0");
  const base = `#${channel(match[1])}${channel(match[2])}${channel(match[3])}`.toUpperCase();
  return match[4] === undefined || match[4] === "1" ? base : `${base} at ${match[4]}`;
}

function hexIn(value: string): string {
  return value.replace(/rgba?\([^)]*\)/g, hex);
}

function radius(value: string): string {
  if (/^(50|100)%$/.test(value)) return "circle";
  const px = parseFloat(value);
  return /^[\d.e+]+px$/.test(value) && px >= 999 ? "pill" : value;
}

function top(map: Count, n: number, label: (key: string) => string = (key) => key): { value: string; count: number }[] {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ value: label(key), count: Math.round(count) }));
}

function signatures<T extends { count: number }>(map: Record<string, T>, n: number) {
  return Object.entries(map)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, n)
    .map(([signature, entry]) => {
      const style = JSON.parse(signature) as Record<string, string | number | boolean>;
      for (const key of ["background", "color", "border"]) if (typeof style[key] === "string") style[key] = hexIn(String(style[key]));
      if (typeof style.radius === "string") style.radius = radius(String(style.radius));
      return { ...style, ...entry };
    });
}

function shape(raw: Raw) {
  const fonts = Object.entries(raw.fonts)
    .sort((a, b) => b[1].chars - a[1].chars)
    .slice(0, 4)
    .map(([family, font]) => ({
      family,
      chars: font.chars,
      weights: top(font.weights, 5).map((w) => w.value),
      sizes: top(font.sizes, 10)
        .map((s) => Number(s.value))
        .sort((a, b) => a - b),
    }));
  const styles = Object.entries(raw.styles)
    .sort((a, b) => b[1].chars - a[1].chars)
    .slice(0, 24)
    .map(([key, style]) => {
      const [family, size, weight, lineHeight, letterSpacing] = key.split("|");
      return { family, size: Number(size), weight, lineHeight, letterSpacing, chars: style.chars, tags: top(style.tags, 3).map((t) => t.value), sample: style.sample };
    });
  const spacing = top(raw.spacing, 16);
  const onFour = spacing.filter((s) => Number(s.value) % 4 === 0).length / Math.max(1, spacing.length);
  const onEight = spacing.filter((s) => Number(s.value) % 8 === 0).length / Math.max(1, spacing.length);
  return {
    title: raw.title,
    lang: raw.lang,
    colorScheme: raw.colorScheme,
    themeColor: raw.themeColor,
    root: { ...raw.root, background: hex(raw.root.background), color: hex(raw.root.color) },
    elements: raw.elements,
    scrollHeight: raw.scrollHeight,
    fonts,
    faces: raw.faces.sort(),
    styles,
    headings: raw.headings,
    backgrounds: top(raw.backgrounds, 12, hex),
    text: top(raw.text, 8, hex),
    borders: top(raw.borders, 6, hex),
    rings: top(raw.rings, 6, hexIn),
    drops: top(raw.drops, 6, hexIn),
    gradients: top(raw.gradients, 3, hexIn),
    radii: top(raw.radii, 8, radius),
    spacing,
    spacingOnFour: Number(onFour.toFixed(2)),
    spacingOnEight: Number(onEight.toFixed(2)),
    sections: top(raw.sections, 8),
    widths: top(raw.widths, 6),
    breakpoints: top(raw.breakpoints, 8),
    header: raw.header ? { ...raw.header, background: hex(raw.header.background) } : null,
    footer: raw.footer ? { ...raw.footer, background: hex(raw.footer.background) } : null,
    cards: signatures(raw.cards, 8),
    inputs: signatures(raw.inputs, 6),
    controls: signatures(raw.controls, 12),
    motion: top(raw.motion, 6),
    tokenCount: raw.tokenCount,
    semanticTokens: raw.semanticTokens,
    tokens: raw.tokens,
  };
}

type Shaped = ReturnType<typeof shape>;

async function settle(page: Page) {
  // Scroll through once so lazy content mounts, then back to the top.
  await page.evaluate(async () => {
    const step = innerHeight;
    for (let y = 0; y < document.documentElement.scrollHeight && y < 12000; y += step) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    scrollTo(0, 0);
    await document.fonts.ready;
  });
  await page.waitForTimeout(600);
}

async function shoot(page: Page, file: string) {
  const cdp = await page.context().newCDPSession(page);
  const { data } = await cdp.send("Page.captureScreenshot", { format: "webp", quality: 80 });
  writeFileSync(file, Buffer.from(data, "base64"));
  await cdp.detach();
}

// A single capture beyond the viewport shows nothing below the fold on a
// site that fades sections in as they arrive and out as they leave. So the
// page is scrolled one viewport at a time, each stop is captured after it
// settles, and the slices are stitched on a canvas in a blank page, where
// no content security policy refuses a data URL. A sticky header is cut
// from every slice but the first, so it appears once.
async function shootFull(page: Page, file: string, headerOffset: number) {
  const { width, height } = page.viewportSize()!;
  const total = Math.min(await page.evaluate(() => document.documentElement.scrollHeight), fullPageCap);
  const cdp = await page.context().newCDPSession(page);
  const slices: { y: number; top: number; data: string }[] = [];
  const step = height - headerOffset;
  for (let i = 0, y = 0; y < total; i++, y += step) {
    const at = await page.evaluate((target) => {
      scrollTo(0, target);
      return scrollY;
    }, y);
    if (slices.length > 0 && at <= slices[slices.length - 1].y) break;
    await page.waitForTimeout(350);
    const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
    slices.push({ y: at, top: i === 0 ? 0 : headerOffset, data });
  }
  await cdp.detach();
  await page.evaluate(() => scrollTo(0, 0));

  const blank = await page.context().newPage();
  await blank.goto("about:blank");
  const url = await blank.evaluate(
    async ({ slices, width, height, total }) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = total;
      const ctx = canvas.getContext("2d")!;
      for (const slice of slices) {
        const image = new Image();
        image.src = `data:image/png;base64,${slice.data}`;
        await image.decode();
        ctx.drawImage(image, 0, slice.top, width, height - slice.top, 0, slice.y + slice.top, width, height - slice.top);
      }
      return canvas.toDataURL("image/webp", 0.6);
    },
    { slices, width, height, total },
  );
  await blank.close();
  writeFileSync(file, Buffer.from(url.slice(url.indexOf(",") + 1), "base64"));
}

async function open(browser: Browser, url: string, viewport: { width: number; height: number }, colorScheme: "light" | "dark") {
  const major = browser.version().split(".")[0];
  const context = await browser.newContext({
    viewport,
    colorScheme,
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
    locale: "en-US",
    userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Safari/537.36`,
  });
  // tsx compiles through esbuild with keepNames on, which wraps every named
  // function in a __name helper. Playwright serialises readPage into the
  // page, where the helper does not exist, so the page gets a no op one.
  await context.addInitScript("globalThis.__name = (fn) => fn;");
  const page = await context.newPage();
  // DOMContentLoaded always comes. Network idle is a bounded bonus, because a
  // marketing page with a video or a long poll never gets there.
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  const status = response?.status() ?? 0;
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
  await settle(page);
  return { context, page, status };
}

const runs = [
  { key: "desktop-light", viewport: viewports.desktop, scheme: "light", full: true },
  { key: "desktop-dark", viewport: viewports.desktop, scheme: "dark", full: false },
  { key: "tablet-light", viewport: viewports.tablet, scheme: "light", full: false },
  { key: "mobile-light", viewport: viewports.mobile, scheme: "light", full: false },
  { key: "mobile-dark", viewport: viewports.mobile, scheme: "dark", full: false },
] as const;

async function main() {
  const args = process.argv.slice(2);
  const url = args.find((arg) => !arg.startsWith("--"));
  if (!url) {
    console.error("Usage: pnpm design:reference <url> [--name <slug>]");
    process.exit(1);
  }
  const host = new URL(url).hostname.replace(/^www\./, "");
  const nameIndex = args.indexOf("--name");
  const name = (nameIndex >= 0 ? args[nameIndex + 1] : host).replace(/[^a-z0-9.]+/gi, "-").toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  const dir = join("docs", "design", "explorations", "references", `${date}-${name}`);
  mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch();
  const screenshots: string[] = [];
  const results: Record<string, Shaped> = {};
  let status = 0;
  try {
    for (const run of runs) {
      const { context, page, status: code } = await open(browser, url, run.viewport, run.scheme);
      status = code;
      if (status >= 400) {
        throw new Error(
          `${host} answered ${status} to a headless browser. Open it in the browser pane or Claude in Chrome, screenshot both schemes at both widths by hand, and say in the reference that the numbers were read by eye.`,
        );
      }
      const shaped = shape(await page.evaluate(readPage));
      results[run.key] = shaped;
      await shoot(page, join(dir, `${run.key}.webp`));
      screenshots.push(`${run.key}.webp`);
      if (run.full) {
        const sticky = shaped.header && (shaped.header.position === "sticky" || shaped.header.position === "fixed") ? shaped.header.height : 0;
        await shootFull(page, join(dir, `${run.key}-full.webp`), sticky);
        screenshots.push(`${run.key}-full.webp`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  const light = results["desktop-light"];
  const dark = results["desktop-dark"];
  const sameScheme = light.root.background === dark.root.background && light.root.color === dark.root.color;
  const data = {
    url,
    name,
    fetchedAt: new Date().toISOString(),
    status,
    viewports,
    fullPageCap,
    screenshots,
    darkFollowsSystem: !sameScheme,
    ...results,
  };
  writeFileSync(join(dir, "data.json"), JSON.stringify(data, null, 2) + "\n");

  const lines = [
    `${light.title} (${status})`,
    `Wrote ${dir}/`,
    `Fonts: ${light.fonts.map((f) => `${f.family} ${f.weights.join("/")} at ${f.sizes.join(", ")}px`).join("; ")}`,
    `Page: ${light.root.background} on light, ${dark.root.background} on dark${sameScheme ? " (same, so no system dark mode)" : ""}`,
    `Text: ${light.text.slice(0, 3).map((t) => t.value).join(", ")}`,
    `Backgrounds by area: ${light.backgrounds.slice(0, 5).map((b) => b.value).join(", ")}`,
    `Radii: ${light.radii.slice(0, 5).map((r) => r.value).join(", ")}`,
    `Hairlines: ${light.borders.length} border colours, ${light.rings.length} ring colours; drop shadows: ${light.drops.length}; gradients: ${light.gradients.length}`,
    `Spacing on a 4px grid: ${Math.round(light.spacingOnFour * 100)}%, on 8px: ${Math.round(light.spacingOnEight * 100)}%; section padding: ${light.sections.map((s) => s.value).join(", ")}px`,
    `Widths: ${light.widths.map((w) => w.value).join(", ")}px; breakpoints: ${light.breakpoints.map((b) => b.value).join(", ") || "none readable"}px; tokens on :root: ${light.tokenCount}`,
    `Header: ${light.header ? `${light.header.tag} ${light.header.height}px ${light.header.position} ${light.header.background}` : "none found"}; footer: ${light.footer ? `${light.footer.columns} columns, ${light.footer.background}` : "none found"}`,
  ];
  console.log(lines.join("\n"));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(2);
});
