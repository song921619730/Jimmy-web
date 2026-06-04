import type { Language } from "./i18n";
import { assetUrl } from "../utils/assetUrl";

export const profileLinks = {
  name: "GangJin Song",
  phone: "+86 17685309985",
  artstation: "https://www.artstation.com/jimmy_song",
  linkedin: "https://www.linkedin.com/in/jimmy-song-30592a1b7/",
  resumePdf: assetUrl("resume/GangJin_Song_Resume_ZH.pdf"),
  resumePdfs: {
    zh: assetUrl("resume/GangJin_Song_Resume_ZH.pdf"),
    en: assetUrl("resume/GangJin_Song_Resume_EN.pdf"),
  } satisfies Record<Language, string>,
};

export const profileContent = {
  zh: {
    brandMeta: "宋港进",
    chineseName: "宋港进",
    email: "921619730@qq.com",
    age: "28",
    role: "3D Artist / 角色服装与材质美术",
    location: "上海",
    currentCompany: "2K Games | Visual Concepts Studio 上海工作室",
    currentPeriod: "2022.06 - 至今",
    intro:
      "拥有 6 年游戏美术与 3D 制作经验，专注角色服装资产、场景资产、PBR 材质贴图，以及 Marvelous Designer / CLO / Substance / Unreal 相关制作流程。",
    secondaryIntro:
      "熟悉从版型设计、布料模拟、拓扑优化、贴图制作到实时引擎呈现的完整流程，参与过 NBA 2K 系列项目，能够在团队协作中提升资产质量与制作效率。",
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
        detail: "参与 NBA 2K26、NBA 2K25、NBA 2K24、NBA 2K23 与 NBA 2K MyTeam 等项目制作。",
      },
      {
        label: "专长",
        title: "角色服装资产全流程",
        meta: "Marvelous Designer / CLO / Style3D",
        detail: "负责角色与服装资产制作，包括版型设计、布料模拟、拓扑整理、资产优化和贴图绘制。",
      },
      {
        label: "ComfyUI",
        title: "AI 生成模型与概念流程",
        meta: "ComfyUI / SD / 生成模型工作流",
        detail: "熟悉 AI 生成模型在游戏美术前期流程中的应用，能够搭建 ComfyUI 工作流，用于角色服装、道具、场景和材质方向的参考图生成、概念探索、风格测试与批量迭代。",
      },
      {
        label: "Vibe Coding",
        title: "流程工具与脚本开发",
        meta: "Pipeline Tools / Scripts / Custom Nodes",
        detail: "能够基于具体生产流程快速制作配套工具、批处理脚本和自动化方案，并开发自定义 ComfyUI 节点，提升参考生成、资产整理和流程衔接效率。",
      },
    ],
    resumeTimeline: [
      {
        period: "2022.06 - 至今",
        title: "2K Games | Visual Concepts Studio 上海工作室",
        role: "3D Artist",
        details: [
          "参与 NBA 2K26 / 2K25 / 2K24 / 2K23 Arcade Edition、NBA 2K MyTeam 等项目，负责角色服装、身体资产、运动员发型资产和部分场景资产制作。",
          "使用 Marvelous Designer 完成服装版型与布料模拟，结合拓扑优化、贴图绘制、PBR 材质节点和 VC 编辑器内验证，保证资产符合游戏内效果与性能要求。",
        ],
      },
      {
        period: "2020.10 - 2022.05",
        title: "CLO Virtual Fashion | Marvelous Designer Team",
        role: "Marvelous Designer 官方培训师 / 社区管理员",
        details: [
          "为 EA、Virtuos 等企业美术团队提供 Marvelous Designer 技术支持，协助优化服装制作流程、资产质量和团队使用规范。",
          "负责中文社区技术答疑、教程制作、案例发布，以及 MD / CLO 预设资产整理，帮助用户解决服装模拟与 3D 软件协同中的流程问题。",
        ],
      },
      {
        period: "2019.10 - 2020.10",
        title: "点晴科技",
        role: "3D 场景美术",
        details: [
          "参与移动游戏场景、道具和模块化资产制作，负责建模、PBR 贴图和基础材质表现。",
          "面向 iOS / Android 平台进行实时资产优化，通过模型层级、贴图与材质整合控制性能预算，并保持画面可读性。",
        ],
      },
      {
        period: "2020 - 2024",
        title: "Freelance 3D Artist",
        role: "移动游戏角色套装制作",
        details: [
          "参与《和平精英》《极品飞车》《巅峰极速》《闪耀暖暖》《柳夜熙数字人》等项目相关角色资产制作。",
          "根据项目美术风格制作角色套装，平衡设计还原、材质表现、模型面数和移动端展示效果。",
        ],
      },
      {
        period: "2016.09 - 2020.06",
        title: "贵州民族大学",
        role: "数字媒体艺术 本科学位",
        details: ["数字媒体艺术专业，系统学习三维设计、游戏设计、数字图像处理与 Unity 开发等课程。"],
      },
    ],
    awards: [
      "GGAC 全球游戏美术大赛 2024 年 Style3D 特别奖入选作品",
      "GGAC 全球游戏美术大赛 2019 年校园组 3D 角色优秀奖",
    ],
    skillGroups: [
      { label: "建模", tools: ["Maya", "3D Max", "ZBrush", "Plasticity"] },
      { label: "服装模拟", tools: ["Marvelous Designer", "CLO 3D", "Style3D"] },
      { label: "贴图材质", tools: ["Substance Painter", "Substance Designer"] },
      { label: "游戏引擎", tools: ["Unreal Engine"] },
      { label: "AI 工作流", tools: ["ComfyUI", "Stable Diffusion", "生成模型工作流"] },
      { label: "流程工具", tools: ["Vibe Coding", "Python Scripts", "Custom ComfyUI Nodes"] },
    ],
    workflow: [
      {
        title: "版型到服装资产",
        text: "从参考和剪裁逻辑出发，完成角色服装版型、布料模拟、褶皱控制和可交付资产整理。",
      },
      {
        title: "实时资产优化",
        text: "面向游戏项目整理角色、服装和场景资产，在保证视觉效果的同时控制性能预算，并保持清晰的交付规范。",
      },
      {
        title: "PBR 材质与实时表现",
        text: "使用 Substance 工具链完成材质节点、贴图绘制和布料质感表现，并在 Unreal / VC 编辑器中验证最终效果。",
      },
      {
        title: "AI 参考与流程工具",
        text: "结合 ComfyUI、AI 生成模型和脚本工具，用于参考生成、概念探索、材质方向测试和前期方案沟通。",
      },
    ],
  },
  en: {
    brandMeta: "3D Artist",
    chineseName: "GangJin Song",
    email: "song921619730@gmail.com",
    age: "28",
    role: "3D Artist / Character Clothing and Material Artist",
    location: "Shanghai",
    currentCompany: "2K Games | Visual Concepts Studio Shanghai",
    currentPeriod: "2022.06 - Present",
    intro:
      "3D artist with 6 years of game art and 3D production experience, specializing in character clothing assets, environment assets, PBR material texturing, and Marvelous Designer / CLO / Substance / Unreal workflows.",
    secondaryIntro:
      "Experienced across pattern design, cloth simulation, topology optimization, texture production, and realtime engine presentation. Contributed to the NBA 2K series while improving asset quality and production efficiency in team workflows.",
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
        title: "Full character clothing asset pipeline",
        meta: "Marvelous Designer / CLO / Style3D",
        detail: "Handles character and garment asset production, including pattern design, cloth simulation, retopology cleanup, asset optimization, and texture painting.",
      },
      {
        label: "ComfyUI",
        title: "AI generation models and concept workflows",
        meta: "ComfyUI / SD / generation model workflows",
        detail: "Experienced in applying AI generation models to early-stage game art workflows, building ComfyUI pipelines for character costumes, props, environments, and material direction references, concept exploration, style testing, and batch iteration.",
      },
      {
        label: "Vibe Coding",
        title: "Pipeline tools and script development",
        meta: "Pipeline tools / scripts / custom nodes",
        detail: "Rapidly builds production-specific tools, batch scripts, and automation, including custom ComfyUI nodes that improve reference generation, asset organization, and workflow handoff.",
      },
    ],
    resumeTimeline: [
      {
        period: "2022.06 - Present",
        title: "2K Games | Visual Concepts Studio Shanghai",
        role: "3D Artist",
        details: [
          "Contributed to NBA 2K26 / 2K25 / 2K24 / 2K23 Arcade Edition, NBA 2K MyTeam, and related projects, creating character clothing, body assets, athlete hairstyle assets, and selected environment assets.",
          "Used Marvelous Designer for garment patterns and cloth simulation, then completed retopology, texture painting, PBR material nodes, and VC editor validation to meet in-game visual and performance requirements.",
        ],
      },
      {
        period: "2020.10 - 2022.05",
        title: "CLO Virtual Fashion | Marvelous Designer Team",
        role: "Marvelous Designer official trainer and community manager",
        details: [
          "Provided Marvelous Designer technical support for enterprise art teams including EA and Virtuos, helping improve garment workflows, asset quality, and team usage standards.",
          "Handled China community Q&A, tutorial creation, case publishing, and MD / CLO preset asset organization, helping users solve cloth simulation and 3D software workflow issues.",
        ],
      },
      {
        period: "2019.10 - 2020.10",
        title: "ALCHEMY Information technology",
        role: "3D Environment Artist",
        details: [
          "Created mobile game environment, prop, and modular assets, including modeling, PBR texture work, and basic material presentation.",
          "Optimized realtime assets for iOS / Android through model-level planning, texture merging, and material consolidation while maintaining visual readability.",
        ],
      },
      {
        period: "2020 - 2024",
        title: "Freelance 3D Artist",
        role: "Mobile game character outfit production",
        details: [
          "Created character outfit assets for projects including Peace Elite, Need for Speed, Racing Master, Shining Nikki, and Liu Yexi Digital Human.",
          "Built client-specific outfit sets while balancing design accuracy, material quality, polygon budgets, and mobile presentation needs.",
        ],
      },
      {
        period: "2016.09 - 2020.06",
        title: "Guizhou Minzu University",
        role: "Bachelor of Digital Media Art",
        details: ["Studied 3D design, game design, digital image processing, Unity development, photography, and visual composition."],
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
      { label: "AI workflow", tools: ["ComfyUI", "Stable Diffusion", "generation model workflows"] },
      { label: "Pipeline tools", tools: ["Vibe Coding", "Python Scripts", "Custom ComfyUI Nodes"] },
    ],
    workflow: [
      {
        title: "Pattern to garment asset",
        text: "Starts from references and tailoring logic to deliver garment patterns, cloth simulation, fold control, and organized production-ready assets.",
      },
      {
        title: "Realtime asset optimization",
        text: "Prepares character, garment, and environment assets for game production while balancing visual quality, performance budgets, and clean delivery standards.",
      },
      {
        title: "PBR materials and realtime lookdev",
        text: "Creates material nodes, painted textures, and fabric response in the Substance toolchain, then validates final presentation in Unreal / VC editors.",
      },
      {
        title: "AI references and pipeline tools",
        text: "Uses ComfyUI, AI generation models, and scripting tools for reference generation, concept exploration, material direction testing, and early-stage visual communication.",
      },
    ],
  },
} satisfies Record<Language, unknown>;
