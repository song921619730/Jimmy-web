import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
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
  return `/${parts.join("/")}`.replace(/\\/g, "/");
}

async function ensureOutputDirs() {
  await Promise.all([
    mkdir(path.join(mediaDir, "thumbs"), { recursive: true }),
    mkdir(path.join(mediaDir, "large"), { recursive: true }),
    mkdir(path.join(mediaDir, "originals"), { recursive: true }),
    mkdir(path.join(mediaDir, "posters"), { recursive: true }),
    mkdir(path.join(mediaDir, "videos"), { recursive: true }),
    mkdir(path.dirname(dataFile), { recursive: true }),
  ]);
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
  const stem = `${projectSlug}-${String(index).padStart(3, "0")}`;
  const source = path.join(resourceDir, projectName, fileName);
  const thumbFile = path.join(mediaDir, "thumbs", `${stem}.webp`);
  const originalName = `${stem}${ext}`;
  const originalFile = path.join(mediaDir, "originals", originalName);

  const image = sharp(source).rotate();
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const ratio = width && height ? width / height : 1;

  await Promise.all([
    sharp(source)
      .rotate()
      .resize({ width: 720, height: 720, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 76 })
      .toFile(thumbFile),
    copyFile(source, originalFile),
  ]);

  return {
    id: stem,
    project: projectSlug,
    type: "image",
    alt: `${projectName} ${fileName}`,
    thumb: publicPath("media", "thumbs", `${stem}.webp`),
    src: publicPath("media", "originals", originalName),
    width,
    height,
    ratio,
  };
}

async function makeVideo(projectName, fileName, index) {
  const ext = path.extname(fileName).toLowerCase();
  if (!videoExtensions.has(ext)) return null;

  const projectSlug = slugify(projectName);
  const stem = `${projectSlug}-${String(index).padStart(3, "0")}`;
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
    src: publicPath("media", "videos", videoName),
    width: 16,
    height: 9,
    ratio: 16 / 9,
  };
}

async function buildManifest() {
  await ensureOutputDirs();

  const projects = (await readdir(resourceDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => {
      const ai = projectOrder.indexOf(a);
      const bi = projectOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b, "zh-Hans-CN");
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

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

  const content = `export type GeneratedMediaItem = {
  id: string;
  project: string;
  type: "image" | "video";
  alt: string;
  thumb: string;
  src: string;
  width: number;
  height: number;
  ratio: number;
};

export const generatedMedia = ${JSON.stringify(media, null, 2)} satisfies GeneratedMediaItem[];
`;

  await writeFile(dataFile, content, "utf8");
  console.log(`Generated ${media.length} media items.`);
}

buildManifest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
