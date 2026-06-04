import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const targetDir = path.join(root, "public", "resume");

const outputs = {
  zh: path.join(targetDir, "GangJin_Song_Resume_ZH.pdf"),
  en: path.join(targetDir, "GangJin_Song_Resume_EN.pdf"),
  legacy: path.join(targetDir, "Jimmy_Song_AI_3D_Resume.pdf"),
};

const commonLinks = {
  phone: "+86 17685309985",
  artstation: "https://www.artstation.com/jimmy_song",
  linkedin: "https://www.linkedin.com/in/jimmy-song-30592a1b7/",
};

const resumes = {
  zh: {
    lang: "zh-CN",
    output: outputs.zh,
    name: "宋港进",
    romanizedName: "GangJin Song",
    title: "3D Artist / 角色服装与材质美术",
    email: "921619730@qq.com",
    meta: ["上海", "28 岁", "6 年游戏美术与 3D 制作经验"],
    labels: {
      profile: "个人简介",
      highlights: "核心优势",
      experience: "工作经历",
      projects: "代表项目",
      skills: "技能",
      education: "教育经历",
      awards: "奖项",
      contact: "联系方式",
      projectPrefix: "项目",
    },
    experienceBreak: true,
    profile: [
      "3D Artist，拥有 6 年游戏美术与 3D 生产经验，现任 2K Games | Visual Concepts Studio 上海工作室 3D Artist。",
      "专注角色服装资产、身体与发型资产、场景资产、PBR 材质贴图和实时资产优化；熟悉从版型设计、布料模拟、拓扑清理、贴图材质到引擎验证的完整交付流程。",
      "能够结合 ComfyUI / Stable Diffusion 进行前期参考生成、概念探索、风格测试和批量迭代，也能通过脚本、流程工具和自定义 ComfyUI 节点提升资产整理与制作效率。",
    ],
    highlights: [
      {
        label: "游戏项目经验",
        text: "参与 NBA 2K26、NBA 2K25、NBA 2K24、NBA 2K23、NBA 2K MyTeam 等项目，并为《和平精英》《极品飞车》《巅峰极速》《闪耀暖暖》《柳夜熙数字人》等项目制作角色套装相关资产。",
      },
      {
        label: "角色服装全流程",
        text: "以 Marvelous Designer / CLO / Style3D 为核心，完成服装版型、布料模拟、褶皱控制、拓扑整理、资产优化和贴图绘制。",
      },
      {
        label: "材质与实时表现",
        text: "使用 Substance Painter / Designer 制作 PBR 贴图和材质节点，并在 Unreal Engine、Unity 或 VC 编辑器中验证最终表现。",
      },
      {
        label: "AI 与流程工具",
        text: "熟悉 ComfyUI、生成模型工作流、批处理脚本和自定义节点开发，可用于参考生成、材质方向测试、资产归档和流程衔接。",
      },
    ],
    experience: [
      {
        period: "2022.06 - 至今",
        company: "2K Games | Visual Concepts Studio 上海工作室",
        role: "3D Artist",
        projects: "NBA 2K26 / 2K25 / 2K24 / 2K23 Arcade Edition、NBA 2K MyTeam",
        bullets: [
          "负责角色服装、身体资产、运动员发型资产和部分场景资产制作，保证资产符合项目风格、实时性能和游戏内表现要求。",
          "使用 Marvelous Designer 完成服装版型与布料模拟，并结合拓扑优化、贴图绘制、PBR 材质节点和 VC 编辑器内验证完成可交付资产。",
          "制作和优化带有 LODs 与碰撞体的场景资产，包括树木、道具和建筑；参与城市地图编辑关卡，并管理光照贴图烘焙流程。",
          "在 VC 材质编辑器中搭建基础材质、混合材质、动画材质和定制材质节点，提升服装、织物、球场和场景资产的材质表现。",
          "制定和实践 Marvelous Designer 制作规范，为团队提供服装资产技术支持，帮助提升服装生产效率和交付稳定性。",
        ],
      },
      {
        period: "2020.10 - 2022.05",
        company: "CLO Virtual Fashion | Marvelous Designer Team",
        role: "Marvelous Designer 官方培训师 / 中文社区管理员",
        bullets: [
          "为 EA、Virtuos 等企业美术团队提供 Marvelous Designer 技术支持，协助优化服装制作流程、资产质量和团队使用规范。",
          "负责中文社区技术答疑、教程制作、案例发布和 MD / CLO 预设资产整理，帮助用户解决服装模拟与 3D 软件协同中的流程问题。",
          "围绕服装版型、布料模拟、导入导出、拓扑衔接和渲染表现沉淀培训内容，提升团队与社区用户的工具使用效率。",
        ],
      },
      {
        period: "2019.10 - 2020.10",
        company: "点晴科技",
        role: "3D 场景美术",
        bullets: [
          "参与移动游戏场景、道具和模块化资产制作，负责建模、PBR 贴图和基础材质表现。",
          "面向 iOS / Android 平台进行实时资产优化，通过模型层级、贴图与材质整合控制性能预算，同时保持画面可读性。",
        ],
      },
      {
        period: "2020 - 2024",
        company: "Freelance 3D Artist",
        role: "移动游戏角色套装制作",
        bullets: [
          "参与《和平精英》《极品飞车》《巅峰极速》《闪耀暖暖》《柳夜熙数字人》等项目相关角色套装制作。",
          "根据项目美术风格制作角色套装，平衡设计还原、布料质感、材质表现、模型面数和移动端展示效果。",
        ],
      },
    ],
    projects: [
      "NBA 2K26 / 2K25 / 2K24 / 2K23 Arcade Edition",
      "NBA 2K MyTeam",
      "和平精英 / 极品飞车 / 巅峰极速 / 闪耀暖暖 / 柳夜熙数字人",
      "GGAC 2024 Style3D 特别奖入选作品",
    ],
    skills: [
      ["建模", "Maya / 3D Max / ZBrush / Plasticity"],
      ["服装模拟", "Marvelous Designer / CLO 3D / Style3D"],
      ["贴图材质", "Substance Painter / Substance Designer / PBR 材质节点"],
      ["游戏引擎", "Unreal Engine / Unity / VC Editor"],
      ["AI 工作流", "ComfyUI / Stable Diffusion / 生成模型工作流"],
      ["流程工具", "Vibe Coding / Python Scripts / Custom ComfyUI Nodes"],
    ],
    education: {
      period: "2016.09 - 2020.06",
      school: "贵州民族大学",
      degree: "数字媒体艺术 本科学位",
      details: "系统学习三维设计、游戏设计、数字图像处理、Unity 开发、摄影、视觉构成与数字媒体艺术相关课程。",
    },
    awards: [
      "GGAC 全球游戏美术大赛 2024 年 Style3D 特别奖入选作品",
      "GGAC 全球游戏美术大赛 2019 年校园组 3D 角色优秀奖",
    ],
  },
  en: {
    lang: "en",
    output: outputs.en,
    name: "GangJin Song",
    romanizedName: "Song Gangjin",
    title: "3D Artist / Character Clothing and Material Artist",
    email: "song921619730@gmail.com",
    meta: ["Shanghai", "28 years old", "6 years in game art and 3D production"],
    labels: {
      profile: "Profile",
      highlights: "Core Strengths",
      experience: "Experience",
      projects: "Selected Projects",
      skills: "Skills",
      education: "Education",
      awards: "Awards",
      contact: "Contact",
      projectPrefix: "Projects",
    },
    experienceBreak: false,
    profile: [
      "3D Artist with 6 years of game art and 3D production experience, currently at 2K Games | Visual Concepts Studio Shanghai.",
      "Specializes in character clothing, body and hairstyle assets, environment assets, PBR texturing, and realtime optimization, covering the full workflow from garment patterning and cloth simulation to topology cleanup, material work, and engine validation.",
      "Uses ComfyUI, Stable Diffusion, scripts, and custom nodes to support reference generation, concept exploration, batch iteration, asset organization, and production handoff.",
    ],
    highlights: [
      {
        label: "Game production experience",
        text: "Contributed to NBA 2K26, NBA 2K25, NBA 2K24, NBA 2K23, NBA 2K MyTeam, and mobile character outfit projects.",
      },
      {
        label: "Character clothing pipeline",
        text: "Builds garment assets with Marvelous Designer, CLO, and Style3D, covering patterns, cloth simulation, fold control, retopology, optimization, and texture painting.",
      },
      {
        label: "Materials and realtime lookdev",
        text: "Creates PBR textures and material nodes with Substance tools, then validates presentation in Unreal Engine, Unity, or the VC editor.",
      },
      {
        label: "AI and workflow tools",
        text: "Builds ComfyUI workflows, batch scripts, and custom nodes for references, material tests, asset organization, and pipeline handoff.",
      },
    ],
    experience: [
      {
        period: "2022.06 - Present",
        company: "2K Games | Visual Concepts Studio Shanghai",
        role: "3D Artist",
        projects: "NBA 2K26 / 2K25 / 2K24 / 2K23 Arcade Edition, NBA 2K MyTeam",
        bullets: [
          "Create character clothing, body assets, athlete hairstyles, and selected environment assets for NBA 2K projects, meeting style, performance, and in-game visual requirements.",
          "Use Marvelous Designer for garment patterning and simulation, then complete retopology, texture painting, PBR material nodes, and VC editor validation.",
          "Build optimized environment assets with LODs and collision, support city map editing, lightmap baking, and VC material node authoring.",
          "Define Marvelous Designer production standards and provide garment workflow support to improve team efficiency and delivery consistency.",
        ],
      },
      {
        period: "2020.10 - 2022.05",
        company: "CLO Virtual Fashion | Marvelous Designer Team",
        role: "Marvelous Designer Official Trainer / China Community Manager",
        bullets: [
          "Provided Marvelous Designer technical support for enterprise art teams including EA and Virtuos, improving garment workflows, asset quality, and team usage standards.",
          "Handled China community Q&A, tutorials, case publishing, and MD / CLO preset assets, covering cloth simulation, import/export, topology handoff, and presentation workflows.",
        ],
      },
      {
        period: "2019.10 - 2020.10",
        company: "ALCHEMY Information Technology",
        role: "3D Environment Artist",
        bullets: [
          "Created mobile game environment, prop, and modular assets, including modeling, PBR textures, and material presentation.",
          "Optimized iOS and Android realtime assets through model planning, texture merging, and material consolidation while maintaining readability.",
        ],
      },
      {
        period: "2020 - 2024",
        company: "Freelance 3D Artist",
        role: "Mobile Game Character Outfit Production",
        bullets: [
          "Created character outfit assets for Peace Elite, Need for Speed, Racing Master, Shining Nikki, and Liu Yexi Digital Human.",
          "Balanced design accuracy, fabric quality, material presentation, polygon budgets, and mobile display needs.",
        ],
      },
    ],
    projects: [
      "NBA 2K26 / 2K25 / 2K24 / 2K23 Arcade Edition",
      "NBA 2K MyTeam",
      "Peace Elite / Need for Speed / Racing Master / Shining Nikki / Liu Yexi Digital Human",
      "GGAC Global Game Art Contest 2024, Style3D Special Award selected work",
    ],
    skills: [
      ["Modeling", "Maya / 3D Max / ZBrush / Plasticity"],
      ["Cloth simulation", "Marvelous Designer / CLO 3D / Style3D"],
      ["Texturing and materials", "Substance Painter / Substance Designer / PBR material nodes"],
      ["Game engines", "Unreal Engine / Unity / VC Editor"],
      ["AI workflow", "ComfyUI / Stable Diffusion / generation model workflows"],
      ["Pipeline tools", "Vibe Coding / Python Scripts / Custom ComfyUI Nodes"],
    ],
    education: {
      period: "2016.09 - 2020.06",
      school: "Guizhou Minzu University",
      degree: "Bachelor of Digital Media Art",
      details: "Studied 3D design, game design, digital image processing, Unity development, photography, visual composition, and digital media art.",
    },
    awards: [
      "GGAC Global Game Art Contest 2024, Style3D Special Award, selected work",
      "GGAC Global Game Art Contest 2019, Campus Group, 3D Character Excellence Award",
    ],
  },
};

async function generateResumePdf() {
  await mkdir(targetDir, { recursive: true });

  let browser;
  try {
    browser = await chromium.launch();
    await renderPdf(browser, resumes.zh, outputs.zh);
    await renderPdf(browser, resumes.zh, outputs.legacy);
    await renderPdf(browser, resumes.en, outputs.en);
  } finally {
    await browser?.close();
  }
}

async function renderPdf(browser, resume, outputPath) {
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } });
  try {
    await page.setContent(renderResumeHtml(resume), { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log(`Generated text resume PDF: ${outputPath}`);
  } finally {
    await page.close();
  }
}

function renderResumeHtml(data) {
  return `<!doctype html>
<html lang="${escapeHtml(data.lang)}">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(data.name)} Resume</title>
    <style>
      @page {
        size: A4;
        margin: 12mm 13mm 14mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: #151515;
        background: #fff;
        font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", Arial, sans-serif;
        font-size: 9.15pt;
        line-height: 1.48;
      }

      h1,
      h2,
      h3,
      p,
      ul {
        margin: 0;
      }

      ul {
        padding-left: 13pt;
      }

      li + li {
        margin-top: 3pt;
      }

      .resume {
        max-width: 190mm;
        margin: 0 auto;
      }

      .header {
        display: grid;
        grid-template-columns: 1fr 0.78fr;
        gap: 11mm;
        padding-bottom: 6mm;
        border-bottom: 1.5pt solid #111;
      }

      .name {
        font-size: 25pt;
        line-height: 1.05;
        font-weight: 800;
        letter-spacing: 0;
      }

      .romanized {
        margin-top: 2pt;
        color: #4f4f4f;
        font-size: 10pt;
        font-weight: 700;
      }

      .title {
        margin-top: 5pt;
        font-size: 11.2pt;
        font-weight: 800;
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4pt 9pt;
        margin-top: 5pt;
        color: #4a4a4a;
      }

      .contacts {
        display: grid;
        gap: 3.2pt;
        align-content: start;
        font-size: 8.65pt;
      }

      .contact-row,
      .skill-row {
        display: grid;
        grid-template-columns: 48pt 1fr;
        gap: 6pt;
      }

      .label {
        color: #686868;
        font-size: 7.2pt;
        font-weight: 800;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .section {
        margin-top: 6.2mm;
      }

      .section h2 {
        padding-bottom: 2.2pt;
        border-bottom: 0.75pt solid #b8b8b8;
        font-size: 11.5pt;
        font-weight: 800;
        letter-spacing: 0;
      }

      .profile {
        display: grid;
        gap: 3.2pt;
        margin-top: 3.4mm;
      }

      .highlight-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4mm 6mm;
        margin-top: 3.4mm;
      }

      .highlight {
        break-inside: avoid;
      }

      .highlight h3,
      .entry h3 {
        font-size: 9.8pt;
        font-weight: 800;
      }

      .highlight p {
        margin-top: 1.5pt;
        color: #363636;
      }

      .entry {
        break-inside: avoid;
        margin-top: 4.1mm;
      }

      .entry-head {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8pt;
        align-items: start;
      }

      .period {
        color: #555;
        font-size: 8.25pt;
        font-weight: 800;
        white-space: nowrap;
      }

      .role {
        margin-top: 1pt;
        color: #333;
        font-weight: 800;
      }

      .projects {
        margin-top: 2pt;
        color: #555;
        font-size: 8.4pt;
      }

      .entry ul {
        margin-top: 3pt;
      }

      .page-break {
        break-before: page;
      }

      .two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8mm;
      }

      .project-list,
      .skill-grid,
      .compact-list {
        display: grid;
        gap: 3pt;
        margin-top: 3.4mm;
      }

      .education p + p {
        margin-top: 2pt;
      }

      .resume.compact {
        font-size: 8.55pt;
        line-height: 1.4;
      }

      .resume.compact .header {
        padding-bottom: 5mm;
      }

      .resume.compact .name {
        font-size: 23pt;
      }

      .resume.compact .title {
        margin-top: 4pt;
        font-size: 10.5pt;
      }

      .resume.compact .section {
        margin-top: 5mm;
      }

      .resume.compact .profile,
      .resume.compact .highlight-grid,
      .resume.compact .project-list,
      .resume.compact .skill-grid,
      .resume.compact .compact-list {
        margin-top: 2.8mm;
      }

      .resume.compact .entry {
        break-inside: auto;
        margin-top: 3.4mm;
      }
    </style>
  </head>
  <body>
    <main class="resume${data.lang === "en" ? " compact" : ""}">
      <header class="header">
        <div>
          <h1 class="name">${escapeHtml(data.name)}</h1>
          <p class="romanized">${escapeHtml(data.romanizedName)}</p>
          <p class="title">${escapeHtml(data.title)}</p>
          <p class="meta">${data.meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</p>
        </div>
        <div class="contacts" aria-label="${escapeHtml(data.labels.contact)}">
          ${renderContact("Phone", commonLinks.phone)}
          ${renderContact("Email", data.email)}
          ${renderContact("ArtStation", commonLinks.artstation)}
          ${renderContact("LinkedIn", commonLinks.linkedin)}
        </div>
      </header>

      <section class="section">
        <h2>${escapeHtml(data.labels.profile)}</h2>
        <div class="profile">
          ${data.profile.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
        </div>
      </section>

      <section class="section">
        <h2>${escapeHtml(data.labels.highlights)}</h2>
        <div class="highlight-grid">
          ${data.highlights.map(renderHighlight).join("")}
        </div>
      </section>

      ${renderExperienceSections(data)}

      <div class="two-col">
        <section class="section">
          <h2>${escapeHtml(data.labels.projects)}</h2>
          <div class="project-list">
            ${data.projects.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
          </div>
        </section>
        <section class="section">
          <h2>${escapeHtml(data.labels.skills)}</h2>
          <div class="skill-grid">
            ${data.skills.map(renderSkill).join("")}
          </div>
        </section>
      </div>

      <div class="two-col">
        <section class="section education">
          <h2>${escapeHtml(data.labels.education)}</h2>
          ${renderEducation(data.education)}
        </section>
        <section class="section">
          <h2>${escapeHtml(data.labels.awards)}</h2>
          <div class="compact-list">
            ${data.awards.map((award) => `<p>${escapeHtml(award)}</p>`).join("")}
          </div>
        </section>
      </div>
    </main>
  </body>
</html>`;
}

function renderContact(label, value) {
  return `<p class="contact-row"><span class="label">${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></p>`;
}

function renderHighlight(item) {
  return `<article class="highlight">
    <h3>${escapeHtml(item.label)}</h3>
    <p>${escapeHtml(item.text)}</p>
  </article>`;
}

function renderExperienceSections(data) {
  if (!data.experienceBreak) {
    return `<section class="section">
      <h2>${escapeHtml(data.labels.experience)}</h2>
      ${data.experience.map((item) => renderExperience(item, data.labels.projectPrefix)).join("")}
    </section>`;
  }

  return `<section class="section">
    <h2>${escapeHtml(data.labels.experience)}</h2>
    ${data.experience.slice(0, 2).map((item) => renderExperience(item, data.labels.projectPrefix)).join("")}
  </section>

  <section class="section page-break">
    <h2>${escapeHtml(data.labels.experience)}</h2>
    ${data.experience.slice(2).map((item) => renderExperience(item, data.labels.projectPrefix)).join("")}
  </section>`;
}

function renderExperience(item, projectPrefix) {
  return `<article class="entry">
    <div class="entry-head">
      <div>
        <h3>${escapeHtml(item.company)}</h3>
        <p class="role">${escapeHtml(item.role)}</p>
        ${item.projects ? `<p class="projects">${escapeHtml(projectPrefix)}: ${escapeHtml(item.projects)}</p>` : ""}
      </div>
      <p class="period">${escapeHtml(item.period)}</p>
    </div>
    <ul>
      ${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
    </ul>
  </article>`;
}

function renderEducation(item) {
  return `<article class="entry">
    <div class="entry-head">
      <div>
        <h3>${escapeHtml(item.school)}</h3>
        <p class="role">${escapeHtml(item.degree)}</p>
      </div>
      <p class="period">${escapeHtml(item.period)}</p>
    </div>
    <p class="projects">${escapeHtml(item.details)}</p>
  </article>`;
}

function renderSkill([label, value]) {
  return `<p class="skill-row"><span class="label">${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></p>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

generateResumePdf().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
