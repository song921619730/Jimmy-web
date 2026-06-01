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

export const projects: Project[] = [
  {
    slug: "spacesuit",
    title: "Astronaut Suit System",
    eyebrow: "Realtime cinematic costume",
    year: "2024",
    category: "Unreal / Costume",
    summary: "Hard-surface suit presentation with cinematic Unreal lighting and material validation.",
    detail:
      "A sci-fi costume showcase built around close-up material reads, silhouette control, helmet detail, and in-engine presentation.",
    accent: "#6f8c9a",
    coverHint: "spacesuit-000",
    tags: ["Unreal", "Suit design", "PBR", "Lighting"],
  },
  {
    slug: "cloth",
    title: "Digital Clothing Library",
    eyebrow: "MD / CLO garment production",
    year: "2020-2026",
    category: "Character clothing",
    summary: "A broad clothing archive covering suits, dresses, shoes, qipao silhouettes, and production breakdowns.",
    detail:
      "Garments emphasize pattern readability, sculptural folds, texture response, and handoff-ready assets for characters and scenes.",
    accent: "#b54848",
    coverHint: "cloth-000",
    tags: ["Marvelous Designer", "CLO 3D", "Garment", "Lookdev"],
  },
  {
    slug: "nba2k",
    title: "NBA 2K Arcade Outfits",
    eyebrow: "2K Games / Visual Concepts",
    year: "2022-2026",
    category: "Shipped game art",
    summary: "Production work for NBA 2K Arcade Edition clothing, hair, and athlete-style game assets.",
    detail:
      "Focused on consistent garment style, readable sports silhouettes, optimized assets, and production support across multiple releases.",
    accent: "#d93226",
    coverHint: "nba2k-000",
    tags: ["2K", "Game art", "LOD", "Character assets"],
  },
  {
    slug: "pubg-mobile",
    title: "Mobile Character Costumes",
    eyebrow: "Freelance / mobile game work",
    year: "2020-2024",
    category: "Mobile game costume",
    summary: "Stylized and semi-realistic costume work for mobile games, with attention to material clarity at small screen sizes.",
    detail:
      "Assets balance expressive silhouettes, efficient geometry, mobile-friendly textures, and consistent presentation across views.",
    accent: "#997247",
    coverHint: "pubg-mobile-000",
    tags: ["Mobile", "Costume", "Optimization", "Character"],
  },
  {
    slug: "substance-designer",
    title: "Owl Goblet Material Study",
    eyebrow: "Procedural material craft",
    year: "2024",
    category: "Substance Designer",
    summary: "A procedural decorative goblet study exploring relief detail, aged metal, scratches, and ornament rhythm.",
    detail:
      "The series highlights material layering, carved relief, procedural wear, and high-frequency detail control for close-up renders.",
    accent: "#788f2f",
    coverHint: "substance-designer-000",
    tags: ["Designer", "Painter", "Procedural", "Material"],
  },
  {
    slug: "props",
    title: "Props and Production Assets",
    eyebrow: "Game-ready object work",
    year: "2019-2024",
    category: "Props",
    summary: "Props and support assets built for readable shape, clean surfaces, and efficient real-time presentation.",
    detail:
      "A compact archive of object studies that round out the portfolio with material work, prop modeling, and presentation polish.",
    accent: "#4f5f5f",
    coverHint: "props-000",
    tags: ["Props", "Modeling", "Texturing", "Realtime"],
  },
];
