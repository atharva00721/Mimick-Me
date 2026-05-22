export const PORTFOLIO_SECTION_REGISTRY = [
  { key: "hero", label: "Hero", defaultVisible: true },
  { key: "about", label: "About", defaultVisible: true },
  { key: "services", label: "Services", defaultVisible: true },
  { key: "projects", label: "Projects", defaultVisible: true },
  { key: "products", label: "Products", defaultVisible: false },
  { key: "history", label: "History", defaultVisible: false },
  { key: "testimonials", label: "Testimonials", defaultVisible: false },
  { key: "faq", label: "FAQ", defaultVisible: false },
  { key: "gallery", label: "Gallery", defaultVisible: false },
  { key: "cta", label: "Contact / CTA", defaultVisible: true },
] as const;

export type PortfolioSectionKey = (typeof PORTFOLIO_SECTION_REGISTRY)[number]["key"];

const DEFAULT_VISIBLE_SECTION_KEYS = PORTFOLIO_SECTION_REGISTRY
  .filter((section) => section.defaultVisible)
  .map((section) => section.key);

const SECTION_KEY_SET = new Set<PortfolioSectionKey>(
  PORTFOLIO_SECTION_REGISTRY.map((section) => section.key)
);

function normalizeSectionKey(value: string): PortfolioSectionKey | null {
  const normalized = value.trim().toLowerCase();
  if (SECTION_KEY_SET.has(normalized as PortfolioSectionKey)) {
    return normalized as PortfolioSectionKey;
  }

  const alias = PORTFOLIO_SECTION_REGISTRY.find(
    (section) => section.label.toLowerCase() === normalized
  );

  return alias?.key ?? null;
}

export function getDefaultVisibleSections(): PortfolioSectionKey[] {
  return [...DEFAULT_VISIBLE_SECTION_KEYS];
}

export function mergeVisibleSections(
  value: unknown,
  fallback = getDefaultVisibleSections()
): PortfolioSectionKey[] {
  const base = new Set<PortfolioSectionKey>(fallback);
  if (!Array.isArray(value)) {
    return [...base];
  }

  const selected = value
    .map((item) => (typeof item === "string" ? normalizeSectionKey(item) : null))
    .filter((item): item is PortfolioSectionKey => item !== null);

  if (selected.length === 0) {
    return [...base];
  }

  return [...new Set(selected)];
}

export function isSectionVisible(
  visibleSections: readonly PortfolioSectionKey[],
  section: PortfolioSectionKey
) {
  return visibleSections.includes(section);
}

export function calculateSectionCount(
  visibleSections: unknown,
  fallback = getDefaultVisibleSections()
): number {
  return mergeVisibleSections(visibleSections, fallback).length;
}
