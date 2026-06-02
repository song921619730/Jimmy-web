import type { Language } from "./i18n";

export const profileLinks = {
  name: "GangJin Song",
  phone: "+86 17685309985",
  artstation: "https://www.artstation.com/jimmy_song",
  linkedin: "https://www.linkedin.com/in/jimmy-song-30592a1b7/",
  resumePdf: "/resume/Jimmy_Song_AI_3D_Resume.pdf",
};

export const profileContent = {
  zh: {
    brandMeta: "宋港进",
    chineseName: "宋港进",
    email: "921619730@qq.com",
    age: "28",
    role: "3D Artist / 数字服装专家",
    location: "上海",
    currentCompany: "2K Games | Visual Concepts Studio 上海工作室",
    currentPeriod: "2022.06 - 至今",
    intro:
      "拥有 6 年游戏美术与 3D 制作经验，专注角色服装全流程、场景资产、材质贴图，以及 Marvelous Designer / CLO / Substance / Unreal 生产管线。",
    secondaryIntro:
      "熟悉从版型设计、布料模拟、拓扑优化、贴图制作到实时引擎呈现的完整链路，参与 NBA 2K 系列项目，能够跨职能协作提升美术资产质量与生产效率。",
    stats: [
      { label: "游戏美术与 3D 制作经验", value: "6+" },
      { label: "当前职位", value: "2K Games / 3D Artist" },
      { label: "核心管线", value: "PBR 全流程" },
    ],
    resumeHighlights: [
      {
        label: "当前",
        title: "3D Artist",
        meta: "2K Games | Visual Concepts Studio 上海工作室",
        detail: "参与 NBA 2K26、NBA 2K25、NBA 2K24、NBA 2K23 与 NBA 2K MyTeam 等项目。",
      },
      {
        label: "专长",
        title: "角色服装全流程",
        meta: "Marvelous Designer / CLO / Style3D",
        detail: "负责角色与服装资产制作、LOD 优化、版片设计、布料模拟、拓扑优化和贴图绘制。",
      },
      {
        label: "ComfyUI",
        title: "AI 生成模型与概念流程",
        meta: "ComfyUI / SD / 生成模型工作流",
        detail: "熟悉 AI 生成模型在游戏美术前期流程中的应用，能够搭建 ComfyUI 工作流，用于角色服装、道具、场景、材质方向的参考图生成、概念探索、风格测试和批量迭代。",
      },
      {
        label: "Vibe Coding",
        title: "流程工具与脚本开发",
        meta: "Pipeline Tools / Scripts / Custom Nodes",
        detail: "基于具体生产流程快速制作配套小工具、批处理脚本和自动化方案，并能开发自定义 ComfyUI 节点，提升参考生成、资产整理和流程衔接效率。",
      },
    ],
    resumeTimeline: [
      {
        period: "2022.06 - 至今",
        title: "2K Games | Visual Concepts Studio 上海工作室",
        role: "3D Artist",
      },
      {
        period: "2020.10 - 2022.05",
        title: "CLO Virtual Fashion | Marvelous Designer Team",
        role: "Marvelous Designer 官方培训师兼社区管理员",
      },
      {
        period: "2019.10 - 2020.10",
        title: "点晴科技",
        role: "3D 场景美术",
      },
      {
        period: "2016.09 - 2020.06",
        title: "贵州民族大学",
        role: "数字媒体艺术 本科学位",
      },
    ],
    awards: [
      "GGAC 全球游戏美术大赛 2024 年 Style3D 特别奖 精选作品",
      "GGAC 全球游戏美术大赛 2019 年 校园组 3D 角色优秀奖",
    ],
    skillGroups: [
      { label: "建模", tools: ["Maya", "3D Max", "ZBrush", "Plasticity"] },
      { label: "服装模拟", tools: ["Marvelous Designer", "CLO 3D", "Style3D"] },
      { label: "贴图材质", tools: ["Substance Painter", "Substance Designer"] },
      { label: "游戏引擎", tools: ["Unreal Engine"] },
    ],
    workflow: [
      {
        title: "版型到服装资产",
        text: "从参考与剪裁逻辑出发，完成角色服装版型、布料模拟、褶皱控制和可交付资产整理。",
      },
      {
        title: "生产拓扑与 LOD",
        text: "面向游戏项目优化头部、身体、服装和场景资产，保证风格一致性、性能预算和协作可读性。",
      },
      {
        title: "PBR 材质与实时表现",
        text: "在 Substance 工具链中完成材质节点、贴图绘制和布料质感，并在 Unreal/VC 编辑器中验证表现。",
      },
      {
        title: "AI 辅助工作流",
        text: "结合 AI 参考探索、材质方向和沟通文档，提高前期迭代速度，同时保留手工制作与审美判断。",
      },
    ],
  },
  en: {
    brandMeta: "3D Artist",
    chineseName: "GangJin Song",
    email: "song921619730@gmail.com",
    age: "28",
    role: "3D Artist / Digital Clothing Specialist",
    location: "Shanghai",
    currentCompany: "2K Games | Visual Concepts Studio Shanghai",
    currentPeriod: "2022.06 - Present",
    intro:
      "3D artist with 6 years of game art and 3D production experience, specializing in character clothing pipelines, scene assets, material texturing, and Marvelous Designer / CLO / Substance / Unreal workflows.",
    secondaryIntro:
      "Experienced across pattern design, cloth simulation, topology optimization, texture production, and realtime engine presentation. Contributed to the NBA 2K series while improving asset quality and production efficiency across teams.",
    stats: [
      { label: "Game art and 3D production", value: "6+" },
      { label: "Current role", value: "2K Games / 3D Artist" },
      { label: "Core pipeline", value: "Full PBR Pipeline" },
    ],
    resumeHighlights: [
      {
        label: "Current",
        title: "3D Artist",
        meta: "2K Games | Visual Concepts Studio Shanghai",
        detail: "Contributed to NBA 2K26, NBA 2K25, NBA 2K24, NBA 2K23, NBA 2K MyTeam, and related productions.",
      },
      {
        label: "Specialty",
        title: "Full character clothing pipeline",
        meta: "Marvelous Designer / CLO / Style3D",
        detail: "Owns character and garment asset production, LOD optimization, pattern design, cloth simulation, retopology, and texture painting.",
      },
      {
        label: "ComfyUI",
        title: "AI generation models and concept workflows",
        meta: "ComfyUI / SD / generation model workflows",
        detail: "Experienced in applying AI generation models to early-stage game art workflows, building ComfyUI pipelines for character costumes, props, environments, material direction references, concept exploration, style testing, and batch iteration.",
      },
      {
        label: "Vibe Coding",
        title: "Pipeline tools and script development",
        meta: "Pipeline tools / scripts / custom nodes",
        detail: "Rapidly builds small tools, batch scripts, and automation around production needs, including custom ComfyUI nodes that improve reference generation, asset organization, and workflow handoff.",
      },
    ],
    resumeTimeline: [
      {
        period: "2022.06 - Present",
        title: "2K Games | Visual Concepts Studio Shanghai",
        role: "3D Artist",
      },
      {
        period: "2020.10 - 2022.05",
        title: "CLO Virtual Fashion | Marvelous Designer Team",
        role: "Marvelous Designer official trainer and community manager",
      },
      {
        period: "2019.10 - 2020.10",
        title: "ALCHEMY Information technology",
        role: "3D Environment Artist",
      },
      {
        period: "2016.09 - 2020.06",
        title: "Guizhou Minzu University",
        role: "Bachelor of Digital Media Art",
      },
    ],
    awards: [
      "GGAC Global Game Art Contest 2024, Style3D Special Award, selected work",
      "GGAC Global Game Art Contest 2019, Campus Group, 3D Character Excellence Award",
    ],
    skillGroups: [
      { label: "Modeling", tools: ["Maya", "3D Max", "ZBrush", "Plasticity"] },
      { label: "Cloth simulation", tools: ["Marvelous Designer", "CLO 3D", "Style3D"] },
      { label: "Texturing and materials", tools: ["Substance Painter", "Substance Designer"] },
      { label: "Game engine", tools: ["Unreal Engine"] },
    ],
    workflow: [
      {
        title: "Pattern to garment asset",
        text: "Starts from references and tailoring logic to deliver garment patterns, cloth simulation, fold control, and production-ready asset organization.",
      },
      {
        title: "Production topology and LOD",
        text: "Optimizes heads, bodies, garments, and environment assets for game projects while protecting style consistency, performance budgets, and team readability.",
      },
      {
        title: "PBR materials and realtime lookdev",
        text: "Creates material nodes, painted textures, and fabric response in the Substance toolchain, then validates presentation in Unreal or VC editors.",
      },
      {
        title: "AI-assisted workflow",
        text: "Uses AI for reference exploration, material direction, and communication documents to speed up early iteration while preserving craft and art direction judgment.",
      },
    ],
  },
} satisfies Record<Language, unknown>;
