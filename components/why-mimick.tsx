export default function WhyMimick() {
  const points = [
    {
      title: "Stop losing qualified leads",
      description: "Most freelancers and boutique agencies lose work before a real conversation starts. Visitors skim project thumbnails and bounce because they don't know if you're available, if your offer fits, or what the next step is. Contact forms are slow, and static pages can't answer follow-up questions.",
    },
    {
      title: "Grounded in your actual expertise",
      description: "Upload your own materials (project history, offer details, FAQs), and our assistant uses retrieval-augmented generation (RAG) to fetch relevant facts. Answers stay grounded in your real expertise instead of drifting into generic chatbot filler.",
    },
    {
      title: "A complete conversion system",
      description: "Mimick.me is not just another chatbot or portfolio builder. It combines brand-aligned conversational UX, factual knowledge retrieval, and conversion workflows (like Calendar scheduling) into one seamless experience.",
    },
    {
      title: "Focus only on serious prospects",
      description: "Instead of answering the same pre-sale questions repeatedly, let your agent handle first-line discovery 24/7. Focus your time on high-confidence leads that are already qualified. Give yourself a measurable advantage.",
    }
  ]

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl text-balance">
              Why Mimick.me
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl text-balance">
              Turning static portfolios into intelligent conversion surfaces that work while you sleep. Give your visitors a responsive, always-on agent that explains your work and qualifies intent.
            </p>
          </div>

          <div className="lg:col-span-1" />

          <div className="lg:col-span-6 flex flex-col gap-16">
            {points.map((point, i) => (
              <div key={i} className="group relative pl-8 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border hover:before:bg-primary/50 before:transition-colors">
                {/* <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full border border-primary/50 bg-background transition-colors group-hover:border-primary group-hover:bg-primary" /> */}
                <h3 className="text-xl font-medium text-foreground mb-4 tracking-tight">{point.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
