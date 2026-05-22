import { TabsContent } from "@/components/ui/tabs";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { ServicesSection } from "../components/ServicesSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ProductsSection } from "../components/ProductsSection";
import { HistorySection } from "../components/HistorySection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { FAQSection } from "../components/FAQSection";
import { GallerySection } from "../components/GallerySection";
import { CTASection } from "../components/CTASection";
import { SocialLinksSection } from "../components/SocialLinksSection";
import { AVAILABLE_SOCIAL_PLATFORMS } from "../_constants/portfolio-editor";
import type { usePortfolioContentEditors } from "../_hooks/use-portfolio-content-editors";
import type { PortfolioContent } from "../../actions";
import type { SocialLink, SocialPlatform } from "@/lib/validation/portfolio-schema";
import type { PortfolioSectionKey } from "@/lib/portfolio/section-registry";

type Editors = ReturnType<typeof usePortfolioContentEditors>;

interface PortfolioTabSectionsProps {
  displayContent: PortfolioContent | null;
  editors: Editors;
  isContentSectionVisible: (section: PortfolioSectionKey) => boolean;
  getSocialLink: (platform: SocialPlatform) => SocialLink | undefined;
}

export function PortfolioTabSections({
  displayContent,
  editors,
  isContentSectionVisible,
  getSocialLink,
}: PortfolioTabSectionsProps) {
  return (
    <>
      <TabsContent value="hero" className="mt-0 focus-visible:outline-none focus-visible:ring-0 h-full">
        <HeroSection
          editMode={true}
          content={displayContent?.hero || null}
          onUpdate={editors.updateHero}
          isVisible={isContentSectionVisible("hero")}
          onVisibilityChange={(checked) => editors.updateVisibleSection("hero", checked)}
        />
      </TabsContent>
      <TabsContent value="about" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
        <AboutSection
          editMode={true}
          content={displayContent?.about || null}
          onUpdate={editors.updateAbout}
          onUpdateImage={editors.updateAboutImage}
          isVisible={isContentSectionVisible("about")}
          onVisibilityChange={(checked) => editors.updateVisibleSection("about", checked)}
        />
      </TabsContent>
      <TabsContent value="services" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
        <ServicesSection
          editMode={true}
          content={displayContent?.services || null}
          onUpdate={editors.updateService}
          onAdd={editors.addService}
          onRemove={editors.removeService}
          isVisible={isContentSectionVisible("services")}
          onVisibilityChange={(checked) => editors.updateVisibleSection("services", checked)}
        />
      </TabsContent>
      <TabsContent value="projects" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
        <ProjectsSection
          editMode={true}
          content={displayContent?.projects || null}
          onUpdate={editors.updateProject}
          onAdd={editors.addProject}
          onRemove={editors.removeProject}
          isVisible={isContentSectionVisible("projects")}
          onVisibilityChange={(checked) => editors.updateVisibleSection("projects", checked)}
        />
      </TabsContent>
      <TabsContent value="products" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
        <ProductsSection
          editMode={true}
          content={displayContent?.products || null}
          onUpdate={editors.updateProduct}
          onAdd={editors.addProduct}
          onRemove={editors.removeProduct}
          isVisible={isContentSectionVisible("products")}
          onVisibilityChange={(checked) => editors.updateVisibleSection("products", checked)}
        />
      </TabsContent>
      <TabsContent value="history" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
        <HistorySection
          editMode={true}
          content={displayContent?.history || null}
          onUpdate={editors.updateHistory}
          onAdd={editors.addHistory}
          onRemove={editors.removeHistory}
          isVisible={isContentSectionVisible("history")}
          onVisibilityChange={(checked) => editors.updateVisibleSection("history", checked)}
        />
      </TabsContent>
      <TabsContent value="testimonials" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
        <TestimonialsSection
          editMode={true}
          content={displayContent?.testimonials || null}
          onUpdate={editors.updateTestimonial}
          onAdd={editors.addTestimonial}
          onRemove={editors.removeTestimonial}
          isVisible={isContentSectionVisible("testimonials")}
          onVisibilityChange={(checked) => editors.updateVisibleSection("testimonials", checked)}
        />
      </TabsContent>
      <TabsContent value="faq" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
        <FAQSection
          editMode={true}
          content={displayContent?.faq || null}
          onUpdate={editors.updateFaq}
          onAdd={editors.addFaq}
          onRemove={editors.removeFaq}
          isVisible={isContentSectionVisible("faq")}
          onVisibilityChange={(checked) => editors.updateVisibleSection("faq", checked)}
        />
      </TabsContent>
      <TabsContent value="gallery" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
        <GallerySection
          editMode={true}
          content={displayContent?.gallery || null}
          onUpdate={editors.updateGallery}
          onAdd={editors.addGalleryImage}
          onRemove={editors.removeGalleryImage}
          isVisible={isContentSectionVisible("gallery")}
          onVisibilityChange={(checked) => editors.updateVisibleSection("gallery", checked)}
        />
      </TabsContent>
      <TabsContent value="cta" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
        <CTASection
          editMode={true}
          content={displayContent?.cta || null}
          onUpdate={editors.updateCta}
          isVisible={isContentSectionVisible("cta")}
          onVisibilityChange={(checked) => editors.updateVisibleSection("cta", checked)}
        />
      </TabsContent>
      <TabsContent value="socials" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
        <SocialLinksSection
          editMode={true}
          availablePlatforms={AVAILABLE_SOCIAL_PLATFORMS}
          getSocialLink={getSocialLink}
          onUpdate={editors.updateSocialLink}
          isVisible={true}
        />
      </TabsContent>
    </>
  );
}
