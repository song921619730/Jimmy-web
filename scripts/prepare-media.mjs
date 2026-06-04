import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const resourceDir = path.join(root, "resource");
const publicDir = path.join(root, "public");
const mediaDir = path.join(publicDir, "media");
const dataFile = path.join(root, "src", "data", "generatedMedia.ts");

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const videoExtensions = new Set([".mp4", ".mov", ".webm"]);
const skipFiles = new Set(["简历.png"]);

const projectOrder = [
  "spacesuit",
  "cloth",
  "NBA2K",
  "PUBG mobile",
  "substance designer",
  "props",
  "soldier",
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function publicPath(...parts) {
  return parts.join("/").replace(/\\/g, "/");
}

function stableMediaIndex(projectSlug, index) {
  if (projectSlug === "cloth") return index + 2;
  if (projectSlug === "props" && index >= 6) return index + 1;
  return index;
}

const imageVariants = {
  thumb: {
    dir: "thumbs",
    width: 720,
    height: 720,
    webpQuality: 78,
    avifQuality: 62,
  },
  large: {
    dir: "large",
    width: 1920,
    height: 1920,
    webpQuality: 88,
    avifQuality: 74,
  },
};

async function resetOutputDirs() {
  await Promise.all([
    rm(path.join(mediaDir, "thumbs"), { recursive: true, force: true }),
    rm(path.join(mediaDir, "large"), { recursive: true, force: true }),
    rm(path.join(mediaDir, "posters"), { recursive: true, force: true }),
    rm(path.join(mediaDir, "videos"), { recursive: true, force: true }),
    rm(path.join(mediaDir, "originals"), { recursive: true, force: true }),
  ]);

  await Promise.all([
    mkdir(path.join(mediaDir, "thumbs"), { recursive: true }),
    mkdir(path.join(mediaDir, "large"), { recursive: true }),
    mkdir(path.join(mediaDir, "posters"), { recursive: true }),
    mkdir(path.join(mediaDir, "videos"), { recursive: true }),
    mkdir(path.dirname(dataFile), { recursive: true }),
  ]);
}

async function writeImageVariant(source, stem, variant) {
  const webpName = `${stem}.webp`;
  const avifName = `${stem}.avif`;
  const webpFile = path.join(mediaDir, variant.dir, webpName);
  const avifFile = path.join(mediaDir, variant.dir, avifName);
  const resizeOptions = {
    width: variant.width,
    height: variant.height,
    fit: "inside",
    withoutEnlargement: true,
  };

  await Promise.all([
    sharp(source)
      .rotate()
      .resize(resizeOptions)
      .webp({ quality: variant.webpQuality, effort: 5, smartSubsample: true })
      .toFile(webpFile),
    sharp(source)
      .rotate()
      .resize(resizeOptions)
      .avif({ quality: variant.avifQuality, effort: 5, chromaSubsampling: "4:4:4" })
      .toFile(avifFile),
  ]);

  const metadata = await sharp(webpFile).metadata();

  return {
    webp: publicPath("media", variant.dir, webpName),
    avif: publicPath("media", variant.dir, avifName),
    width: metadata.width ?? variant.width,
    height: metadata.height ?? variant.height,
  };
}

async function listProjectFiles(projectName) {
  const dir = path.join(resourceDir, projectName);
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && !skipFiles.has(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));
}

async function makeImage(projectName, fileName, index) {
  const ext = path.extname(fileName).toLowerCase();
  if (!imageExtensions.has(ext)) return null;

  const projectSlug = slugify(projectName);
  const stem = `${projectSlug}-${String(stableMediaIndex(projectSlug, index)).padStart(3, "0")}`;
  const source = path.join(resourceDir, projectName, fileName);

  const image = sharp(source).rotate();
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const ratio = width && height ? width / height : 1;

  const [thumb, large] = await Promise.all([
    writeImageVariant(source, stem, imageVariants.thumb),
    writeImageVariant(source, stem, imageVariants.large),
  ]);

  return {
    id: stem,
    project: projectSlug,
    type: "image",
    alt: `${projectName} ${fileName}`,
    thumb: thumb.webp,
    thumbAvif: thumb.avif,
    src: large.webp,
    srcAvif: large.avif,
    width,
    height,
    thumbWidth: thumb.width,
    thumbHeight: thumb.height,
    srcWidth: large.width,
    srcHeight: large.height,
    ratio,
  };
}

async function makeVideo(projectName, fileName, index) {
  const ext = path.extname(fileName).toLowerCase();
  if (!videoExtensions.has(ext)) return null;

  const projectSlug = slugify(projectName);
  const stem = `${projectSlug}-${String(stableMediaIndex(projectSlug, index)).padStart(3, "0")}`;
  const source = path.join(resourceDir, projectName, fileName);
  const videoName = `${stem}${ext}`;
  const target = path.join(mediaDir, "videos", videoName);
  await copyFile(source, target);

  return {
    id: stem,
    project: projectSlug,
    type: "video",
    alt: `${projectName} ${fileName}`,
    thumb: "",
    thumbAvif: "",
    src: publicPath("media", "videos", videoName),
    srcAvif: "",
    width: 16,
    height: 9,
    thumbWidth: 16,
    thumbHeight: 9,
    srcWidth: 16,
    srcHeight: 9,
    ratio: 16 / 9,
  };
}

async function buildManifest() {
  await resetOutputDirs();

  const availableProjects = new Set(
    (await readdir(resourceDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name),
  );
  const projects = projectOrder.filter((projectName) => availableProjects.has(projectName));

  const media = [];
  for (const projectName of projects) {
    const files = await listProjectFiles(projectName);
    let mediaIndex = 0;
    for (const fileName of files) {
      const image = await makeImage(projectName, fileName, mediaIndex);
      const video = image ? null : await makeVideo(projectName, fileName, mediaIndex);
      const item = image ?? video;
      if (item) {
        media.push(item);
        mediaIndex += 1;
      }
    }
  }

  const content = `import { assetUrl } from "../utils/assetUrl";

export type GeneratedMediaItem = {
  id: string;
  project: string;
  type: "image" | "video";
  alt: string;
  thumb: string;
  thumbAvif: string;
  src: string;
  srcAvif: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  srcWidth: number;
  srcHeight: number;
  ratio: number;
};

const generatedMediaData = ${JSON.stringify(media, null, 2)} satisfies GeneratedMediaItem[];

export const generatedMedia = generatedMediaData.map((item) => ({
  ...item,
  thumb: assetUrl(item.thumb),
  thumbAvif: assetUrl(item.thumbAvif),
  src: assetUrl(item.src),
  srcAvif: assetUrl(item.srcAvif),
})) satisfies GeneratedMediaItem[];
`;

  await writeFile(dataFile, content, "utf8");
  console.log(`Generated ${media.length} media items.`);
}

buildManifest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
