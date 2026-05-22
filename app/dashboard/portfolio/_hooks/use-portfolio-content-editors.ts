import { useCallback } from "react";
import type { PortfolioContent } from "../../actions";
import type { SocialLink, SocialPlatform } from "@/lib/validation/portfolio-schema";
import { mergeVisibleSections, type PortfolioSectionKey } from "@/lib/portfolio/section-registry";

interface UsePortfolioContentEditorsParams {
  editedContent: PortfolioContent | null;
  setEditedContent: (content: PortfolioContent | null) => void;
}

const addListItem = <K extends keyof PortfolioContent>(
  content: PortfolioContent,
  key: K,
  item: NonNullable<PortfolioContent[K]> extends Array<infer T> ? T : never,
) => {
  const current = (content[key] as unknown[] | undefined) ?? [];
  return {
    ...content,
    [key]: [...current, item],
  } as PortfolioContent;
};

const updateListItemField = <K extends keyof PortfolioContent>(
  content: PortfolioContent,
  key: K,
  index: number,
  field: string,
  value: string,
) => {
  const current = content[key] as Record<string, string>[] | undefined;
  if (!current) return null;

  const next = [...current];
  next[index] = { ...next[index], [field]: value };

  return {
    ...content,
    [key]: next,
  } as PortfolioContent;
};

const removeListItem = <K extends keyof PortfolioContent>(content: PortfolioContent, key: K, index: number) => {
  const current = content[key] as unknown[] | undefined;
  if (!current) return null;

  return {
    ...content,
    [key]: current.filter((_, itemIndex) => itemIndex !== index),
  } as PortfolioContent;
};

export function usePortfolioContentEditors({ editedContent, setEditedContent }: UsePortfolioContentEditorsParams) {
  const updateHero = useCallback((field: string, value: string) => {
    if (!editedContent) return;
    setEditedContent({
      ...editedContent,
      hero: { ...editedContent.hero, [field]: value },
    });
  }, [editedContent, setEditedContent]);

  const updateAbout = useCallback((value: string) => {
    if (!editedContent) return;
    setEditedContent({
      ...editedContent,
      about: { ...editedContent.about, paragraph: value },
    });
  }, [editedContent, setEditedContent]);

  const updateAboutImage = useCallback((avatarUrl: string) => {
    if (!editedContent) return;
    setEditedContent({
      ...editedContent,
      about: { ...editedContent.about, avatarUrl },
    });
  }, [editedContent, setEditedContent]);

  const updateCta = useCallback((field: string, value: string) => {
    if (!editedContent) return;
    setEditedContent({
      ...editedContent,
      cta: { ...editedContent.cta, [field]: value },
    });
  }, [editedContent, setEditedContent]);

  const updateService = useCallback((index: number, field: string, value: string) => {
    if (!editedContent) return;
    const next = updateListItemField(editedContent, "services", index, field, value);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const addService = useCallback(() => {
    if (!editedContent) return;
    setEditedContent(addListItem(editedContent, "services", { title: "New Service", description: "Service description" }));
  }, [editedContent, setEditedContent]);

  const removeService = useCallback((index: number) => {
    if (!editedContent) return;
    const next = removeListItem(editedContent, "services", index);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const updateProject = useCallback((index: number, field: string, value: string) => {
    if (!editedContent) return;
    const next = updateListItemField(editedContent, "projects", index, field, value);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const addProject = useCallback(() => {
    if (!editedContent) return;
    setEditedContent(addListItem(editedContent, "projects", { title: "New Project", description: "Project description", result: "Project result" }));
  }, [editedContent, setEditedContent]);

  const removeProject = useCallback((index: number) => {
    if (!editedContent) return;
    const next = removeListItem(editedContent, "projects", index);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const updateProduct = useCallback((index: number, field: string, value: string) => {
    if (!editedContent) return;
    const next = updateListItemField(editedContent, "products", index, field, value);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const addProduct = useCallback(() => {
    if (!editedContent) return;
    setEditedContent(addListItem(editedContent, "products", { title: "New Product", description: "Description", price: "$0.00", url: "", image: "" }));
  }, [editedContent, setEditedContent]);

  const removeProduct = useCallback((index: number) => {
    if (!editedContent) return;
    const next = removeListItem(editedContent, "products", index);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const updateHistory = useCallback((index: number, field: string, value: string) => {
    if (!editedContent) return;
    const next = updateListItemField(editedContent, "history", index, field, value);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const addHistory = useCallback(() => {
    if (!editedContent) return;
    setEditedContent(addListItem(editedContent, "history", { role: "Role", company: "Company", period: "2020-2024", description: "Description" }));
  }, [editedContent, setEditedContent]);

  const removeHistory = useCallback((index: number) => {
    if (!editedContent) return;
    const next = removeListItem(editedContent, "history", index);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const updateTestimonial = useCallback((index: number, field: string, value: string) => {
    if (!editedContent) return;
    const next = updateListItemField(editedContent, "testimonials", index, field, value);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const addTestimonial = useCallback(() => {
    if (!editedContent) return;
    setEditedContent(addListItem(editedContent, "testimonials", { quote: "Great work!", author: "John Doe", role: "CEO" }));
  }, [editedContent, setEditedContent]);

  const removeTestimonial = useCallback((index: number) => {
    if (!editedContent) return;
    const next = removeListItem(editedContent, "testimonials", index);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const updateFaq = useCallback((index: number, field: string, value: string) => {
    if (!editedContent) return;
    const next = updateListItemField(editedContent, "faq", index, field, value);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const addFaq = useCallback(() => {
    if (!editedContent) return;
    setEditedContent(addListItem(editedContent, "faq", { question: "Question?", answer: "Answer" }));
  }, [editedContent, setEditedContent]);

  const removeFaq = useCallback((index: number) => {
    if (!editedContent) return;
    const next = removeListItem(editedContent, "faq", index);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const updateGallery = useCallback((index: number, field: string, value: string) => {
    if (!editedContent) return;
    const next = updateListItemField(editedContent, "gallery", index, field, value);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const addGalleryImage = useCallback(() => {
    if (!editedContent) return;
    setEditedContent(addListItem(editedContent, "gallery", { url: "https://example.com/image.jpg", caption: "Caption" }));
  }, [editedContent, setEditedContent]);

  const removeGalleryImage = useCallback((index: number) => {
    if (!editedContent) return;
    const next = removeListItem(editedContent, "gallery", index);
    if (next) setEditedContent(next);
  }, [editedContent, setEditedContent]);

  const updateVisibleSection = useCallback((section: PortfolioSectionKey, visible: boolean) => {
    if (!editedContent) return;
    const current = mergeVisibleSections(editedContent.visibleSections);
    const next = visible ? [...new Set([...current, section])] : current.filter((key) => key !== section);

    setEditedContent({
      ...editedContent,
      visibleSections: mergeVisibleSections(next),
    });
  }, [editedContent, setEditedContent]);

  const updateSocialLink = useCallback((platform: SocialPlatform, field: "enabled" | "url", value: boolean | string) => {
    if (!editedContent) return;

    const currentLinks = editedContent.socialLinks || [];
    const existingIndex = currentLinks.findIndex((link) => link.platform === platform);

    let nextLinks: SocialLink[];
    if (existingIndex >= 0) {
      nextLinks = [...currentLinks];
      nextLinks[existingIndex] = {
        ...nextLinks[existingIndex],
        [field]: value,
        platform,
      };
    } else {
      nextLinks = [
        ...currentLinks,
        {
          platform,
          enabled: field === "enabled" ? (value as boolean) : false,
          url: field === "url" ? (value as string) : "",
        },
      ];
    }

    setEditedContent({ ...editedContent, socialLinks: nextLinks });
  }, [editedContent, setEditedContent]);

  return {
    updateHero,
    updateAbout,
    updateAboutImage,
    updateCta,
    updateService,
    addService,
    removeService,
    updateProject,
    addProject,
    removeProject,
    updateProduct,
    addProduct,
    removeProduct,
    updateHistory,
    addHistory,
    removeHistory,
    updateTestimonial,
    addTestimonial,
    removeTestimonial,
    updateFaq,
    addFaq,
    removeFaq,
    updateGallery,
    addGalleryImage,
    removeGalleryImage,
    updateVisibleSection,
    updateSocialLink,
  };
}
