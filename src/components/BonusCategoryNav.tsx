import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the mix deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
export const CATCH_ALL_SLUG = 'special-offers'

/**
 * One colour per bonus type, in order, each with the text colour that reads on
 * it at 4.5:1 or better. The mockup's six, the green a shade deeper (white on
 * its #2BA67A is about 3:1), and two more for sites with more types.
 */
const TYPE_COLOURS: ReadonlyArray<{ bg: string; fg: string }> = [
  { bg: '#c2552b', fg: '#ffffff' },
  { bg: '#1a1d33', fg: '#ffffff' },
  { bg: '#1f8a63', fg: '#ffffff' },
  { bg: '#3b5ba9', fg: '#ffffff' },
  { bg: '#d98a2b', fg: '#1a1d33' },
  { bg: '#7a4e9c', fg: '#ffffff' },
  { bg: '#2c7f8c', fg: '#ffffff' },
  { bg: '#a3485f', fg: '#ffffff' },
]

/** The catch-all's colour, wherever it does appear (its group on the home page). */
const CATCH_ALL_COLOUR = { bg: 'var(--color-ink-soft)', fg: '#ffffff' }

/**
 * The colour of each section, by slug — shared by the mix bar, its keys and
 * the home page's bonus groups, so a type is the same colour everywhere.
 */
export function bonusTypeColours(sections: BonusSection[]): Map<string, { bg: string; fg: string }> {
  const colours = new Map<string, { bg: string; fg: string }>()
  sections
    .filter((section) => section.slug !== CATCH_ALL_SLUG)
    .forEach((section, i) => colours.set(section.slug, TYPE_COLOURS[i % TYPE_COLOURS.length]))
  colours.set(CATCH_ALL_SLUG, CATCH_ALL_COLOUR)
  return colours
}

/**
 * "Browse By Bonus Type", from sites/microgamblin.html (`.btwrap`): one deep
 * green panel holding a pill per bonus type — a coloured icon tile, the
 * type's name, and how many offers of it this site carries.
 *
 * Each pill opens that type's own page. The counts are the SITE's — active,
 * claimable, owned by a casino attached here — resolved server-side. Renders
 * nothing when the site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  const colours = bonusTypeColours(sections)
  const total = types.reduce((sum, section) => sum + section.offers_count, 0)

  return (
    <nav aria-labelledby="bonus-types-heading" className="deep-panel rounded-[14px] p-[clamp(22px,4vw,40px)] text-white">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">
        {total} {total === 1 ? 'offer' : 'offers'} listed
      </p>
      <h2 id="bonus-types-heading" className="mb-[22px] mt-2.5 font-display text-[28px] font-bold leading-[1.05] text-white sm:text-[clamp(28px,3.6vw,42px)]">
        {COPY.home.bonusTypesTitle}
      </h2>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]" role="list">
        {types.map((section) => (
          <li key={section.id}>
            <Link
              href={`/bonuses/${section.slug}`}
              className="btype flex min-h-[56px] items-center gap-3 rounded-lg border border-white/25 px-5 py-3 text-[15px] font-semibold text-white"
            >
              <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px]"
                style={{ background: colours.get(section.slug)!.bg }}
              >
                {/* The type's own icon, as in the Bonus menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {section.icon_path && (
                  <img src={resolveImageUrl(section.icon_path)!} alt="" width={17} height={17} className="h-[17px] w-[17px]" />
                )}
              </span>
              <span className="min-w-0 truncate">{section.name}</span>
              <span className="ml-auto text-[13px] font-bold text-night-muted">
                {section.offers_count}
                <span className="sr-only"> {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
