import { readFile } from "node:fs/promises";

/** Poppins for the generated card and link-preview images (bundled with the app). */
export async function ogFonts() {
  const load = (f: string) => readFile(new URL(`../assets/fonts/poppins-latin-${f}.woff`, import.meta.url));
  const [w500, w600, w800, w800i] = await Promise.all([load("500-normal"), load("600-normal"), load("800-normal"), load("800-italic")]);
  return [
    { name: "Poppins", data: w500, weight: 500 as const, style: "normal" as const },
    { name: "Poppins", data: w600, weight: 600 as const, style: "normal" as const },
    { name: "Poppins", data: w800, weight: 800 as const, style: "normal" as const },
    { name: "Poppins", data: w800i, weight: 800 as const, style: "italic" as const },
  ];
}
