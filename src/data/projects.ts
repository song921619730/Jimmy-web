import type { Language } from "./i18n";

export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  year: string;
  category: string;
  summary: string;
  detail: string;
  accent: string;
  coverHint: string;
  tags: string[];
};

const projectMeta = [
  { slug: "spacesuit", year: "2024", accent: "#6f8c9a", coverHint: "spacesuit-000" },
  { slug: "cloth", year: "2020-2026", accent: "#b54848", coverHint: "cloth-002" },
  { slug: "nba2k", year: "2022-2026", accent: "#d93226", coverHint: "nba2k-000" },
  { slug: "pubg-mobile", year: "2020-2024", accent: "#997247", coverHint: "pubg-mobile-000" },
  { slug: "substance-designer", year: "2024", accent: "#788f2f", coverHint: "substance-designer-000" },
  { slug: "props", year: "2019-2024", accent: "#4f5f5f", coverHint: "props-000" },
] as const;

type ProjectCopy = Omit<Project, "slug" | "year" | "accent" | "coverHint">;

const projectCopy: Record<Language, ProjectCopy[]> = {
  zh: [
    {
      title: "宇航服",
      eyebrow: "实时电影感服装",
      category: "Unreal / 服装",
      summary: "硬表面宇航服展示，结合电影感 Unreal 灯光与 PBR 材质验证。",
      detail: "围绕近景材质表现、轮廓控制、头盔细节和引擎内呈现完成的科幻服装展示。",
      tags: ["Unreal", "服装设计", "PBR", "灯光"],
    },
    {
      title: "数字服装库",
      eyebrow: "MD / CLO 服装制作",
      category: "角色服装",
      summary: "包含西装、礼服、鞋履、旗袍等服装资产，以及对应的制作过程拆解。",
      detail: "作品重点展示版型结构、褶皱控制、材质表现，以及面向角色资产交付的制作规范。",
      tags: ["Marvelous Designer", "CLO 3D", "服装", "Lookdev"],
    },
    {
      title: "NBA 2K 服装",
      eyebrow: "2K Games / Visual Concepts",
      category: "已上线游戏美术",
      summary: "参与 NBA 2K 系列服装、发型和运动员风格资产制作。",
      detail: "重点关注运动轮廓、资产规范、LOD 优化，以及跨版本项目的稳定交付。",
      tags: ["2K", "游戏美术", "LOD", "角色资产"],
    },
    {
      title: "PUBG 手游角色套装",
      eyebrow: "自由职业 / 移动游戏项目",
      category: "移动游戏服装",
      summary: "面向移动游戏制作的风格化与半写实角色套装，注重小屏幕下的轮廓识别和材质清晰度。",
      detail: "在表现力、模型面数、贴图效率和多角度展示之间取得平衡。",
      tags: ["移动端", "服装", "优化", "角色"],
    },
    {
      title: "猫头鹰高脚杯",
      eyebrow: "程序化材质工艺",
      category: "Substance Designer",
      summary: "程序化装饰高脚杯材质研究，探索浮雕细节、旧金属、划痕和装饰纹样节奏。",
      detail: "展示材质分层、浮雕雕刻、程序化磨损，以及近景渲染中的高频细节控制。",
      tags: ["Designer", "Painter", "程序化", "材质"],
    },
    {
      title: "道具",
      eyebrow: "游戏道具制作",
      category: "道具",
      summary: "面向实时项目制作的道具资产，关注形体可读性、表面质感和展示完成度。",
      detail: "围绕道具建模、贴图材质和实时展示完成的物件资产整理。",
      tags: ["道具", "建模", "贴图", "实时"],
    },
  ],
  en: [
    {
      title: "Astronaut Suit",
      eyebrow: "Realtime cinematic costume",
      category: "Unreal / Costume",
      summary: "Hard-surface suit presentation with cinematic Unreal lighting and PBR material validation.",
      detail: "A sci-fi costume showcase focused on close-up material quality, silhouette control, helmet detail, and in-engine presentation.",
      tags: ["Unreal", "Suit design", "PBR", "Lighting"],
    },
    {
      title: "Digital Clothing Library",
      eyebrow: "MD / CLO garment creation",
      category: "Character clothing",
      summary: "A clothing asset library covering suits, dresses, shoes, qipao silhouettes, and production breakdowns.",
      detail: "The work highlights pattern structure, fold control, material response, and production standards for character asset delivery.",
      tags: ["Marvelous Designer", "CLO 3D", "Garment", "Lookdev"],
    },
    {
      title: "NBA 2K Outfits",
      eyebrow: "2K Games / Visual Concepts",
      category: "Shipped game art",
      summary: "Contributed clothing, hair, and athlete-style assets for the NBA 2K series.",
      detail: "Focused on readable sports silhouettes, asset standards, LOD optimization, and stable delivery across multiple releases.",
      tags: ["2K", "Game art", "LOD", "Character assets"],
    },
    {
      title: "PUBG Mobile Character Outfit Set",
      eyebrow: "Freelance / mobile game work",
      category: "Mobile game costume",
      summary: "Stylized and semi-realistic character outfit sets for mobile games, with attention to silhouette readability and material clarity on small screens.",
      detail: "Balances expressive shapes, polygon budgets, texture efficiency, and consistent presentation across views.",
      tags: ["Mobile", "Costume", "Optimization", "Character"],
    },
    {
      title: "Owl Goblet",
      eyebrow: "Procedural material craft",
      category: "Substance Designer",
      summary: "A procedural decorative goblet material study exploring relief details, aged metal, scratches, and ornament rhythm.",
      detail: "Highlights material layering, carved relief, procedural wear, and high-frequency detail control for close-up renders.",
      tags: ["Designer", "Painter", "Procedural", "Material"],
    },
    {
      title: "Props",
      eyebrow: "Game prop production",
      category: "Props",
      summary: "Realtime prop assets focused on readable forms, surface quality, and polished presentation.",
      detail: "A compact archive of prop modeling, material texturing, and realtime presentation studies.",
      tags: ["Props", "Modeling", "Texturing", "Realtime"],
    },
  ],
};

export function getProjects(language: Language): Project[] {
  return projectMeta.map((meta, index) => ({ ...meta, ...projectCopy[language][index] }));
}

export const projects = getProjects("en");
