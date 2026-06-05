import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const targetDir = path.join(root, "public", "resume");
const target = path.join(targetDir, "GangJin_Song_Cover_Letter.pdf");
const previewTarget = path.join(root, "tmp", "pdfs", "cover-letter-preview.png");
const shouldWritePreview = process.argv.includes("--preview");

const letter = {
  name: "GangJin Song",
  title: "3D Artist / Character Clothing and Material Artist",
  location: "Shanghai",
  phone: "+86 17685309985",
  email: "song921619730@gmail.com",
  artstation: "artstation.com/jimmy_song",
  linkedin: "linkedin.com/in/jimmy-song-30592a1b7",
  date: "June 5, 2026",
  greeting: "Dear Hiring Team,",
  paragraphs: [
    "I am writing to apply for a 3D Artist, Character Clothing Artist, or Material Artist role. I am a 3D Artist with 6 years of game art and 3D production experience, currently working at 2K Games | Visual Concepts Studio Shanghai, where I contribute to the NBA 2K series.",
    "My work focuses on character clothing assets, body and hairstyle assets, environment assets, PBR materials, and realtime asset optimization. I am experienced across the full production workflow, from garment patterning and cloth simulation in Marvelous Designer, CLO, and Style3D to retopology, texture painting, material node setup, and in-engine validation.",
    "Before joining 2K, I worked with the Marvelous Designer team at CLO Virtual Fashion as an official trainer and China community manager. I provided technical support for enterprise art teams including EA and Virtuos, created training materials, and helped artists solve garment workflow issues between Marvelous Designer and other 3D software.",
    "In addition to traditional 3D production, I use ComfyUI, Stable Diffusion, scripts, and custom workflow tools to support reference generation, concept exploration, batch iteration, asset organization, and production handoff. I enjoy improving both the visual quality of assets and the production efficiency around them.",
    "I would be glad to bring my experience in character clothing production, PBR materials, realtime optimization, and AI-assisted workflows to your team. Thank you for your time and consideration. I look forward to the opportunity to discuss how my background could contribute to your projects.",
  ],
  closing: "Sincerely,",
};

async function generateCoverLetterPdf() {
  await mkdir(targetDir, { recursive: true });

  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } });

    await page.setContent(renderCoverLetterHtml(letter), { waitUntil: "networkidle" });
    if (shouldWritePreview) {
      await mkdir(path.dirname(previewTarget), { recursive: true });
      await page.locator(".page").screenshot({ path: previewTarget });
      console.log(`Generated cover letter preview: ${previewTarget}`);
    }

    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: target,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await browser?.close();
  }

  console.log(`Generated cover letter PDF: ${target}`);
}

function renderCoverLetterHtml(data) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(data.name)} Cover Letter</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: #171717;
        background: #f3f1ec;
        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
        font-size: 10.2pt;
        line-height: 1.55;
      }

      p,
      h1,
      h2 {
        margin: 0;
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        display: grid;
        grid-template-columns: 22mm 1fr;
        background: #fffdfa;
      }

      .rail {
        background: #171717;
        position: relative;
      }

      .rail::after {
        content: "";
        position: absolute;
        left: 10mm;
        top: 18mm;
        bottom: 18mm;
        width: 1px;
        background: rgba(255, 255, 255, 0.28);
      }

      .content {
        padding: 18mm 20mm 17mm 16mm;
      }

      .topline {
        display: flex;
        justify-content: space-between;
        gap: 12mm;
        padding-bottom: 8mm;
        border-bottom: 1px solid #d8d3c9;
      }

      .eyebrow {
        color: #777167;
        font-size: 7.5pt;
        font-weight: 800;
        letter-spacing: 1.2pt;
        text-transform: uppercase;
      }

      h1 {
        margin-top: 3mm;
        font-size: 25pt;
        line-height: 1;
        font-weight: 800;
        letter-spacing: 0;
      }

      .title {
        margin-top: 3mm;
        color: #494640;
        font-size: 10.5pt;
        font-weight: 700;
      }

      .contact {
        min-width: 67mm;
        display: grid;
        gap: 2mm;
        color: #393631;
        font-size: 8.3pt;
        text-align: right;
      }

      .date {
        margin-top: 11mm;
        color: #5b554e;
        font-size: 9.2pt;
        font-weight: 700;
      }

      .letter-body {
        max-width: 156mm;
        margin-top: 8mm;
      }

      .greeting {
        font-size: 11.5pt;
        font-weight: 800;
      }

      .letter-body p + p {
        margin-top: 5.4mm;
      }

      .body-copy {
        color: #2d2a26;
      }

      .signature {
        margin-top: 10mm;
      }

      .signature p + p {
        margin-top: 2.5mm;
      }

      .signature-name {
        font-size: 13pt;
        font-weight: 800;
      }

      .footer-note {
        margin-top: 11mm;
        padding-top: 4mm;
        border-top: 1px solid #d8d3c9;
        color: #777167;
        font-size: 7.8pt;
        letter-spacing: 0.2pt;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <aside class="rail" aria-hidden="true"></aside>
      <section class="content">
        <header class="topline">
          <div>
            <p class="eyebrow">Cover Letter</p>
            <h1>${escapeHtml(data.name)}</h1>
            <p class="title">${escapeHtml(data.title)}</p>
          </div>
          <div class="contact">
            <p>${escapeHtml(data.location)}</p>
            <p>${escapeHtml(data.phone)}</p>
            <p>${escapeHtml(data.email)}</p>
            <p>${escapeHtml(data.artstation)}</p>
            <p>${escapeHtml(data.linkedin)}</p>
          </div>
        </header>

        <p class="date">${escapeHtml(data.date)}</p>

        <article class="letter-body">
          <p class="greeting">${escapeHtml(data.greeting)}</p>
          ${data.paragraphs.map((paragraph) => `<p class="body-copy">${escapeHtml(paragraph)}</p>`).join("")}
        </article>

        <div class="signature">
          <p>${escapeHtml(data.closing)}</p>
          <p class="signature-name">${escapeHtml(data.name)}</p>
        </div>

        <p class="footer-note">Portfolio and resume available on request or through the links above.</p>
      </section>
    </main>
  </body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

generateCoverLetterPdf().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
