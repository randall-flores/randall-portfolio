// Regenerates the optimized project screenshots in public/shots/{slug}/ from
// the raw captures in shots-raw/{slug}/ (kept out of public/ so the 17MB of
// PNG sources never deploys). Run after recapturing:
//   node scripts/shots-process.mjs
// Outputs per project:
//   card-d.webp  desktop card base, 16/9 top-anchored crop, 2560w max
//   card-m.webp  mobile overlay for the card composition, 640w
//   g-*.webp     case-study gallery slides, full viewport frame, 1920w
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const RAW = "shots-raw";
const OUT = "public/shots";

// [slug, cardDesktopSource, gallerySlides[]]
const PROJECTS = [
  ["farewise", "02-results", ["01-search", "02-results"]],
  ["sana", "01-hero", ["01-hero", "02-features", "03-signin"]],
  ["caseflow", "01-client-session", ["01-client-session", "02-treatment", "03-records"]],
  ["adrift", "01-feed", ["01-feed", "02-find", "03-explore"]],
  ["vox", "01-hero", ["01-hero", "02-demos", "03-credits"]],
  ["hollow-ronin", "01-hero", ["01-hero", "02-shop", "03-product", "04-lookbook"]],
];

for (const [slug, cardSrc, slides] of PROJECTS) {
  const dir = `${OUT}/${slug}`;
  mkdirSync(dir, { recursive: true });

  // Card desktop: crop the 16/10 viewport to 16/9 anchored to the top so the
  // app's own header and hero survive, then cap width.
  const meta = await sharp(`${RAW}/${slug}/${cardSrc}.png`).metadata();
  const cropH = Math.round((meta.width * 9) / 16);
  await sharp(`${RAW}/${slug}/${cardSrc}.png`)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.min(cropH, meta.height) })
    .resize({ width: 2560, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`${dir}/card-d.webp`);

  await sharp(`${RAW}/${slug}/m-hero.png`)
    .resize({ width: 640, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`${dir}/card-m.webp`);

  for (const s of slides) {
    await sharp(`${RAW}/${slug}/${s}.png`)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`${dir}/g-${s.replace(/^\d+-/, "")}.webp`);
  }
  console.log(`OK ${slug}`);
}
