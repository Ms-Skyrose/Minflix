/**
 * Copies and shrinks an image on the phone before upload.
 *
 * Why: on Android, Chrome can fail the whole form send when the picked photo is a cloud copy
 * (Google Photos / Drive) that changes or isn't fully on the phone yet. Reading the image once,
 * right when it's picked, and sending a small in-memory copy avoids that, and makes any logo size work.
 */
export class ImageReadError extends Error {}

const MAX_SIDE = 800;

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageReadError("image could not be decoded"));
    };
    img.src = url;
  });
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Returns a small PNG/WebP/JPEG copy (longest side ≤ 800px) as a new Blob held in memory. */
export async function shrinkImage(file: File): Promise<{ blob: Blob; name: string }> {
  // Read the bytes now, while the file is definitely reachable.
  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new ImageReadError("file could not be read");
  }
  const original = new Blob([bytes], { type: file.type || "image/png" });
  const img = await loadImage(original);

  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { blob: original, name: file.name || "logo.png" };
  ctx.drawImage(img, 0, 0, w, h);

  // WebP keeps transparency and stays small; fall back to PNG where WebP encoding isn't supported.
  const webp = await toBlob(canvas, "image/webp", 0.9);
  if (webp && webp.type === "image/webp") return { blob: webp, name: "logo.webp" };
  const png = await toBlob(canvas, "image/png");
  if (png) return { blob: png, name: "logo.png" };
  return { blob: original, name: file.name || "logo.png" };
}

/** Sends a short, anonymous error report so failures can be diagnosed (no form contents are included). */
export function reportClientError(stage: string, err: unknown) {
  try {
    const body = JSON.stringify({
      stage,
      message: String((err as Error)?.message ?? err).slice(0, 500),
      name: String((err as Error)?.name ?? "").slice(0, 60),
      path: location.pathname,
    });
    if (!navigator.sendBeacon?.("/api/client-error", new Blob([body], { type: "application/json" })))
      fetch("/api/client-error", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  } catch {
    /* never let reporting break the page */
  }
}
