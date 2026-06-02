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
  { slug: "cloth", year: "2020-2026", accent: "#b54848", coverHint: "cloth-000" },
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
      summary: "硬表面宇航服展示，结合电影感 Unreal 灯光与材质验证。",
      detail: "围绕近景材质阅读、轮廓控制、头盔细节和引擎内呈现构建的科幻服装展示。",
      tags: ["Unreal", "服装设计", "PBR", "灯光"],
    },
    {
      title: "数字服装库",
      eyebrow: "MD / CLO 服装生产",
      category: "角色服装",
      summary: "覆盖西装、礼服、鞋履、旗袍轮廓和制作拆解的服装档案。",
      detail: "作品强调版型可读性、雕塑感褶皱、材质响应，以及面向角色和场景的可交付资产。",
      tags: ["Marvelous Designer", "CLO 3D", "服装", "Lookdev"],
    },
    {
      title: "NBA 2K 服装",
      eyebrow: "2K Games / Visual Concepts",
      category: "已上线游戏美术",
      summary: "为 NBA 2K 制作服装、发型和运动员风格游戏资产。",
      detail: "聚焦统一服装风格、清晰运动轮廓、优化资产，以及跨多个版本的生产支持。",
      tags: ["2K", "游戏美术", "LOD", "角色资产"],
    },
    {
      title: "PUBG 手游角色套装",
      eyebrow: "自由职业 / 移动游戏项目",
      category: "移动游戏服装",
      summary: "面向移动游戏的风格化与半写实服装，注重小屏幕下的材质清晰度。",
      detail: "资产平衡表现力轮廓、高效几何、移动端友好贴图，以及多视角一致展示。",
      tags: ["移动端", "服装", "优化", "角色"],
    },
    {
      title: "猫头鹰高脚杯",
      eyebrow: "程序化材质工艺",
      category: "Substance Designer",
      summary: "程序化装饰高脚杯研究，探索浮雕细节、旧金属、划痕和纹样节奏。",
      detail: "系列展示材质分层、雕刻浮雕、程序化磨损，以及近景渲染中的高频细节控制。",
      tags: ["Designer", "Painter", "程序化", "材质"],
    },
    {
      title: "道具",
      eyebrow: "游戏就绪物件制作",
      category: "道具",
      summary: "",
      detail: "紧凑的物件研究档案，以材质、道具建模和展示完成度补足作品集结构。",
      tags: ["道具", "建模", "贴图", "实时"],
    },
  ],
  en: [
    {
      title: "Astronaut Suit",
      eyebrow: "Realtime cinematic costume",
      category: "Unreal / Costume",
      summary: "Hard-surface suit presentation with cinematic Unreal lighting and material validation.",
      detail: "A sci-fi costume showcase built around close-up material reads, silhouette control, helmet detail, and in-engine presentation.",
      tags: ["Unreal", "Suit design", "PBR", "Lighting"],
    },
    {
      title: "Digital Clothing Library",
      eyebrow: "MD / CLO garment production",
      category: "Character clothing",
      summary: "A broad clothing archive covering suits, dresses, shoes, qipao silhouettes, and production breakdowns.",
      detail: "Garments emphasize pattern readability, sculptural folds, texture response, and handoff-ready assets for characters and scenes.",
      tags: ["Marvelous Designer", "CLO 3D", "Garment", "Lookdev"],
    },
    {
      title: "NBA 2K Outfits",
      eyebrow: "2K Games / Visual Concepts",
      category: "Shipped game art",
      summary: "Production work for NBA 2K clothing, hair, and athlete-style game assets.",
      detail: "Focused on consistent garment style, readable sports silhouettes, optimized assets, and production support across multiple releases.",
      tags: ["2K", "Game art", "LOD", "Character assets"],
    },
    {
      title: "PUBG Mobile Character Outfit Set",
      eyebrow: "Freelance / mobile game work",
      category: "Mobile game costume",
      summary: "Stylized and semi-realistic costume work for mobile games, with attention to material clarity at small screen sizes.",
      detail: "Assets balance expressive silhouettes, efficient geometry, mobile-friendly textures, and consistent presentation across views.",
      tags: ["Mobile", "Costume", "Optimization", "Character"],
    },
    {
      title: "Owl Goblet",
      eyebrow: "Procedural material craft",
      category: "Substance Designer",
      summary: "A procedural decorative goblet study exploring relief detail, aged metal, scratches, and ornament rhythm.",
      detail: "The series highlights material layering, carved relief, procedural wear, and high-frequency detail control for close-up renders.",
      tags: ["Designer", "Painter", "Procedural", "Material"],
    },
    {
      title: "Props",
      eyebrow: "Game-ready object work",
      category: "Props",
      summary: "",
      detail: "A compact archive of object studies that round out the portfolio with material work, prop modeling, and presentation polish.",
      tags: ["Props", "Modeling", "Texturing", "Realtime"],
    },
  ],
};

export function getProjects(language: Language): Project[] {
  return projectMeta.map((meta, index) => ({ ...meta, ...projectCopy[language][index] }));
}

export const projects = getProjects("en");
