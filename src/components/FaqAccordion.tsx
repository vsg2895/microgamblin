type Item = { readonly question: string; readonly answer: string }

/**
 * The home FAQ, from sites/microgamblin.html (`.faq`/`.fq`): a grid of white
 * cards, each with a lime edge along its top, the question in bold and the
 * answer under it.
 *
 * NOT an accordion, despite the file name — the mockup shows every answer at
 * once, and the name is kept so the page that mounts it needs no edit. Plain
 * markup with no client state: every answer is in the server HTML, which the
 * FAQPage schema built from the same array needs anyway.
 *
 * Three across from 1100px, two from 640px, one on a phone. The last card
 * spans the empty track when an odd one would otherwise sit alone.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="mt-[26px] grid grid-cols-1 gap-5 sm:grid-cols-2 min-[68.75rem]:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.question}
          className="rounded-xl border border-line border-t-4 border-t-accent bg-paper px-8 py-[30px] last:odd:sm:col-span-2 last:odd:min-[68.75rem]:col-span-1"
        >
          <h3 className="mb-3.5 text-[19px] font-bold leading-snug tracking-[-0.01em] text-ink">{item.question}</h3>
          <p className="text-base leading-[1.7] text-ink-soft">{item.answer}</p>
        </div>
      ))}
    </div>
  )
}
