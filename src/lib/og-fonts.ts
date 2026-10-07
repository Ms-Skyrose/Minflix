import { readFile } from "node:fs/promises";
import path from "node:path";

const FONT_DIR = path.join(process.cwd(), "src/assets/fonts");

/** Poppins for the generated card and link-preview images. Returns [] if the files can't be read, so images still render. */
export async function ogFonts() {
  try {
    const load = (f: string) => readFile(path.join(FONT_DIR, `poppins-latin-${f}.woff`));
    const [w500, w600, w800, w800i] = await Promise.all([load("500-normal"), load("600-normal"), load("800-normal"), load("800-italic")]);
    return [
      { name: "Poppins", data: w500, weight: 500 as const, style: "normal" as const },
      { name: "Poppins", data: w600, weight: 600 as const, style: "normal" as const },
      { name: "Poppins", data: w800, weight: 800 as const, style: "normal" as const },
      { name: "Poppins", data: w800i, weight: 800 as const, style: "italic" as const },
    ];
  } catch (err) {
    console.error("ogFonts: falling back to the default font", err);
    return [];
  }
}

/**
 * Fetch a festival logo and return it as a small PNG data URI the image renderer can always read
 * (WebP, big photos and odd formats are converted). Returns null on any failure → initials tile.
 */
export async function logoForCard(url: string | null, size = 296): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const input = Buffer.from(await res.arrayBuffer());
    const sharp = (await import("sharp")).default;
    const png = await sharp(input).rotate().resize(size, size, { fit: "cover" }).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch (err) {
    console.error("logoForCard: using initials instead", err);
    return null;
  }
}
