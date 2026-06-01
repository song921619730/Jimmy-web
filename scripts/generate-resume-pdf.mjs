import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "resource", "简历.png");
const targetDir = path.join(root, "public", "resume");
const target = path.join(targetDir, "Jimmy_Song_AI_3D_Resume.pdf");

async function generateResumePdf() {
  await mkdir(targetDir, { recursive: true });
  const image = sharp(source).rotate().flatten({ background: "#ffffff" });
  const metadata = await image.metadata();
  const width = metadata.width ?? 2400;
  const height = metadata.height ?? 1350;
  const jpeg = await sharp(source)
    .rotate()
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  const pageWidth = 1440;
  const pageHeight = Math.round((pageWidth * height) / width);
  const pdf = makeSingleImagePdf(jpeg, width, height, pageWidth, pageHeight);
  await writeFile(target, pdf);
  console.log(`Generated resume PDF: ${target}`);
}

function makeSingleImagePdf(jpeg, imageWidth, imageHeight, pageWidth, pageHeight) {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
    {
      dictionary: `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>`,
      stream: jpeg,
    },
    {
      dictionary: `<< /Length ${Buffer.byteLength(`q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ\n`, "ascii")} >>`,
      stream: Buffer.from(`q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ\n`, "ascii"),
    },
  ];

  const chunks = [Buffer.from("%PDF-1.4\n", "ascii")];
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.concat(chunks).length);
    chunks.push(Buffer.from(`${index + 1} 0 obj\n`, "ascii"));
    if (typeof object === "string") {
      chunks.push(Buffer.from(`${object}\n`, "ascii"));
    } else {
      chunks.push(Buffer.from(`${object.dictionary}\nstream\n`, "ascii"));
      chunks.push(object.stream);
      chunks.push(Buffer.from("\nendstream\n", "ascii"));
    }
    chunks.push(Buffer.from("endobj\n", "ascii"));
  });

  const xrefOffset = Buffer.concat(chunks).length;
  chunks.push(Buffer.from(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`, "ascii"));
  for (let index = 1; index < offsets.length; index += 1) {
    chunks.push(Buffer.from(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`, "ascii"));
  }
  chunks.push(
    Buffer.from(
      `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
      "ascii",
    ),
  );

  return Buffer.concat(chunks);
}

generateResumePdf().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
