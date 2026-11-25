// Product photos in Supabase Storage have a 480px WebP twin (<name>.thumb.webp, made by scripts/make-thumbnails.ts).
// Grids and small thumbnails use it; if a twin does not exist yet (new product), the <img> falls back to the original.
const PHOTO = /(\/storage\/v1\/object\/public\/media\/products\/.+)\.(png|jpe?g|webp)$/i;

export const thumbUrl = (url: string) => (PHOTO.test(url) && !url.endsWith(".thumb.webp") ? url.replace(PHOTO, "$1.thumb.webp") : url);

// onError handler: swap to the original once, never loop.
export const fallbackTo = (original: string) => (e: { currentTarget: HTMLImageElement }) => {
  const img = e.currentTarget;
  if (img.src !== original && !img.dataset.fellBack) { img.dataset.fellBack = "1"; img.src = original; }
};
