import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { product, theme } from "@/config";

// The card a link to the product shows in a chat or a feed. Drawn on the
// server from the name and the one line, in Geist, on the page colour. It
// cannot read CSS, so the two colours come from config, which a rule test
// holds to the tokens. The sizes below are pixels of a fixed raster, not a
// screen, which is why they are numbers rather than tokens.

export const alt = product.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const geist = await readFile(join(process.cwd(), "src/assets/Geist-Medium.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 96,
          background: theme.light,
          color: theme.ink,
          fontFamily: "Geist",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 500 }}>{product.name}</div>
        <div style={{ fontSize: 64, fontWeight: 500, lineHeight: 1.15, marginTop: 24, maxWidth: 960 }}>{product.oneLine}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: geist, weight: 500, style: "normal" }] },
  );
}
