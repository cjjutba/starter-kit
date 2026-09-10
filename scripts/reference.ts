/**
 * Reads the design of a public website and files the numbers beside
 * screenshots, so the reference skill can map them onto the four knobs in
 * DESIGN.md. Structure only: computed styles, fonts, colours, radii, shadows,
 * spacing, container widths and control styles. It saves no copy and no
 * images from the site, and the screenshots are the evidence of what was
 * looked at, not assets.
 *
 *   pnpm design:reference https://example.com [--name example]
 *
 * Writes docs/design/explorations/references/<date>-<name>/ holding four
 * viewport screenshots, one capped full page, and data.json. Light and dark
 * come from prefers-color-scheme. A site with its own toggle shows its light
 * scheme twice, and the reference says so.
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
  backgrounds: Count;
  text: Count;
  borders: Count;
  gradients: number;
  radii: Count;
  shadows: Count;
  spacing: Count;
  widths: Count;
  controls: Record<string, { count: number; sample: string }>;
  tokens: Record<string, string>;
  tokenCount: number;
  elements: number;
  scrollHeight: number;
}

const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } } as const;
const fullPageCap = 2400;

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
    backgrounds: {},
    text: {},
    borders: {},
    gradients: 0,
    radii: {},
    shadows: {},
    spacing: {},
    widths: {},
    controls: {},
    tokens: {},
    tokenCount: 0,
    elements: 0,
    scrollHeight: rootEl.scrollHeight,
  };

  for (const face of Array.from(document.fonts)) {
    if (face.status === "loaded") raw.faces.push(`${face.family.replace(/"/g, "")} ${face.weight} ${face.style}`);
  }

  // Custom properties declared on :root, html or body in any readable sheet.
  // Cross origin sheets throw on cssRules and are skipped.
  const names = new Set<string>();
  const visit = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        if (/^(:root|html|body)(\b|[[.:])/.test(rule.selectorText)) {
          for (const name of Array.from(rule.style)) if (name.startsWith("--")) names.add(name);
        }
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
  for (const name of Array.from(names).sort().slice(0, 250)) raw.tokens[name] = rootStyle.getPropertyValue(name).trim();

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

    const own = Array.from(el.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => (node.textContent ?? "").trim())
      .join(" ");
    if (own.length > 0) {
      const family = cs.fontFamily.split(",")[0].trim().replace(/^["']|["']$/g, "");
      const font = (raw.fonts[family] ??= { chars: 0, weights: {}, sizes: {} });
      font.chars += own.length;
      bump(font.weights, cs.fontWeight, own.length);
      bump(font.sizes, String(Math.round(parseFloat(cs.fontSize))), own.length);
      bump(raw.text, colour(cs.color), own.length);
    }

    const background = colour(cs.backgroundColor);
    if (background !== "transparent" && !transparent.test(background)) bump(raw.backgrounds, background, area);
    if (cs.backgroundImage !== "none" && /gradient/.test(cs.backgroundImage)) raw.gradients++;

    const sides = [
      [cs.borderTopWidth, cs.borderTopStyle, cs.borderTopColor],
      [cs.borderRightWidth, cs.borderRightStyle, cs.borderRightColor],
      [cs.borderBottomWidth, cs.borderBottomStyle, cs.borderBottomColor],
      [cs.borderLeftWidth, cs.borderLeftStyle, cs.borderLeftColor],
    ].filter(([width, style]) => parseFloat(width) > 0 && style !== "none" && style !== "hidden");
    if (sides.length > 0) bump(raw.borders, colour(sides[0][2]));
    if (cs.borderRadius !== "0px") bump(raw.radii, cs.borderRadius);
    if (cs.boxShadow !== "none") bump(raw.shadows, cs.boxShadow);

    for (const value of [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft, cs.marginTop, cs.marginBottom, cs.rowGap, cs.columnGap]) {
      const px = Math.round(parseFloat(value));
      if (px > 0 && px <= 320) bump(raw.spacing, String(px));
    }
    const maxWidth = parseFloat(cs.maxWidth);
    if (maxWidth >= 480 && maxWidth <= innerWidth) bump(raw.widths, String(Math.round(maxWidth)));

    if (el.matches("a, button, [role='button'], input, select, textarea")) {
      const signature = JSON.stringify({
        tag: el.tagName.toLowerCase(),
        background,
        color: colour(cs.color),
        radius: cs.borderRadius,
        weight: cs.fontWeight,
        size: cs.fontSize,
        padding: cs.padding,
        border: sides.length > 0 ? `${sides[0][0]} ${colour(sides[0][2])}` : "none",
        shadow: cs.boxShadow !== "none",
      });
      const control = (raw.controls[signature] ??= { count: 0, sample: (el.textContent ?? "").trim().slice(0, 40) });
      control.count++;
    }
  }
  raw.elements = seen;
  return raw;
}

// Node side. Turns the raw counts into short sorted lists a person can read.

function hex(colour: string): string {
  const match = colour.match(/^rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)$/);
  if (!match) return colour;
  const channel = (n: string) => Number(n).toString(16).padStart(2, "0");
  const base = `#${channel(match[1])}${channel(match[2])}${channel(match[3])}`.toUpperCase();
  return match[4] === undefined || match[4] === "1" ? base : `${base} at ${match[4]}`;
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

function shape(raw: Raw) {
  const fonts = Object.entries(raw.fonts)
    .sort((a, b) => b[1].chars - a[1].chars)
    .slice(0, 4)
    .map(([family, font]) => ({
      family,
      chars: font.chars,
      weights: top(font.weights, 5).map((w) => w.value),
      sizes: top(font.sizes, 8).map((s) => Number(s.value)).sort((a, b) => a - b),
    }));
  const spacing = top(raw.spacing, 16);
  const onFour = spacing.filter((s) => Number(s.value) % 4 === 0).length / Math.max(1, spacing.length);
  const onEight = spacing.filter((s) => Number(s.value) % 8 === 0).length / Math.max(1, spacing.length);
  const controls = Object.entries(raw.controls)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([signature, control]) => {
      const style = JSON.parse(signature) as Record<string, string | boolean>;
      return { ...style, background: hex(String(style.background)), color: hex(String(style.color)), radius: radius(String(style.radius)), count: control.count, sample: control.sample };
    });
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
    backgrounds: top(raw.backgrounds, 12, hex),
    text: top(raw.text, 8, hex),
    borders: top(raw.borders, 6, hex),
    gradients: raw.gradients,
    radii: top(raw.radii, 8, radius),
    shadows: top(raw.shadows, 5),
    spacing,
    spacingOnFour: Number(onFour.toFixed(2)),
    spacingOnEight: Number(onEight.toFixed(2)),
    widths: top(raw.widths, 6),
    controls,
    tokenCount: raw.tokenCount,
    tokens: raw.tokens,
  };
}

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

async function shoot(page: Page, file: string, full = false) {
  const cdp = await page.context().newCDPSession(page);
  const height = full ? Math.min(await page.evaluate(() => document.documentElement.scrollHeight), fullPageCap) : page.viewportSize()!.height;
  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "webp",
    quality: full ? 70 : 80,
    captureBeyondViewport: full,
    clip: { x: 0, y: 0, width: page.viewportSize()!.width, height, scale: 1 },
  });
  writeFileSync(file, Buffer.from(data, "base64"));
  await cdp.detach();
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
  const schemes: Record<string, ReturnType<typeof shape>> = {};
  let status = 0;
  try {
    for (const colorScheme of ["light", "dark"] as const) {
      const desktop = await open(browser, url, viewports.desktop, colorScheme);
      status = desktop.status;
      if (status >= 400) {
        throw new Error(
          `${host} answered ${status} to a headless browser. Open it in the browser pane or Claude in Chrome, screenshot both schemes by hand, and say in the reference that the numbers were read by eye.`,
        );
      }
      schemes[colorScheme] = shape(await desktop.page.evaluate(readPage));
      const file = `desktop-${colorScheme}.webp`;
      await shoot(desktop.page, join(dir, file));
      screenshots.push(file);
      if (colorScheme === "light") {
        await shoot(desktop.page, join(dir, "desktop-light-full.webp"), true);
        screenshots.push("desktop-light-full.webp");
      }
      await desktop.context.close();

      const mobile = await open(browser, url, viewports.mobile, colorScheme);
      const mobileFile = `mobile-${colorScheme}.webp`;
      await shoot(mobile.page, join(dir, mobileFile));
      screenshots.push(mobileFile);
      await mobile.context.close();
    }
  } finally {
    await browser.close();
  }

  const light = schemes.light;
  const dark = schemes.dark;
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
    light,
    dark,
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
    `Shadows: ${light.shadows.length} distinct; borders: ${light.borders.length} distinct colours; gradients: ${light.gradients}`,
    `Spacing on a 4px grid: ${Math.round(light.spacingOnFour * 100)}%, on 8px: ${Math.round(light.spacingOnEight * 100)}%`,
    `Widths: ${light.widths.map((w) => w.value).join(", ")}px; tokens on :root: ${light.tokenCount}`,
  ];
  console.log(lines.join("\n"));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(2);
});
