import Link from 'next/link'
import { COPY } from '@/constants/copy'
import { OfferRow } from '@/components/SpecialOfferCard'
import { bonusTypeColours } from '@/components/BonusCategoryNav'
import type { BonusSection } from '@/lib/api'

/**
 * The home page's Bonuses: one card per bonus type, two across on a wide
 * screen, each with its offers as rows.
 *
 * This site's own take on the block, in the language the rest of microgamblin
 * uses rather than the sibling sites' rounded cards with a colour dot:
 *
 *  - the type's colour runs along the card's TOP EDGE, exactly as a casino row
 *    carries its accent in `.rw` — no dot;
 *  - the head is a deep-green band, the same brand ground as the hero, with
 *    the type's name in white and HOW MANY OFFERS of it this site carries on a
 *    lime chip. The count is the site's own `offers_count`, already resolved
 *    server-side — the figure a small-stakes reader is actually choosing on;
 *  - everything is squared off (12px on the card, 6px on the chip), because
 *    nothing on this site is a pill but the beating dot.
 *
 * Lime on white is 1.5:1, so it never carries text here either: it is a FILL
 * behind `accent-ink`, and the one piece of lime type sits on the deep-green
 * band, where it clears 4.5:1 comfortably.
 *
 * Every type's offers are in the server HTML, and each card keeps the
 * `#bonus-<slug>` anchor the bonus-type panel's pills land on.
 *
 * A GRID, not `columns-2`. CSS multi-column balances the two columns against
 * each other, so the second card began lower than the first and the pair never
 * shared a top edge. Grid cells on one row start together by definition.
 */
export default function BonusGroups({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  const colours = bonusTypeColours(sections)

  return (
    <div className="mt-[26px] grid items-start gap-5 lg:grid-cols-2">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`bonus-${section.slug}`}
          aria-labelledby={`bonus-${section.slug}-heading`}
          className="scroll-mt-24 overflow-hidden rounded-xl border border-t-4 border-line bg-paper"
          style={{ borderTopColor: colours.get(section.slug)?.bg }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 bg-brand px-4 py-4 sm:px-5">
            <h3 id={`bonus-${section.slug}-heading`} className="flex min-w-0 items-center gap-2.5 font-display text-xl font-bold text-white">
              <span className="truncate">{section.name}</span>
              <span className="shrink-0 rounded-md bg-accent px-2 py-0.5 text-[12px] font-bold text-accent-ink">
                {section.offers_count}
                <span className="sr-only"> offers</span>
              </span>
            </h3>
            <Link
              href={`/bonuses/${section.slug}`}
              className="-my-3 inline-flex min-h-11 items-center py-3 text-sm font-bold text-accent transition-opacity hover:opacity-80"
            >
              {COPY.home.seeMore}<span className="sr-only"> {section.name}</span> <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
          {section.description && <p className="border-b border-line px-4 py-3 text-sm text-ink-soft sm:px-5">{section.description}</p>}
          <ul role="list">
            {section.offers.map((offer) => <OfferRow key={offer.id} offer={offer} />)}
          </ul>
        </section>
      ))}
    </div>
  )
}
