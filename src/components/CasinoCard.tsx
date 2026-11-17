import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** How many region chips a card shows before collapsing the rest into a count. */
const REGIONS_SHOWN = 3

function Stars({ rating }: { rating: number }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at 18px reads as a rendering fault. The
  // exact figure is printed beside it either way.
  const filled = Math.round(rating)

  return (
    <span
      className="inline-flex items-center tracking-[1px] text-[15px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? 'text-gold' : 'text-line-soft'} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/**
 * The list the rows sit in — the mockup's `.rows`. Callers render
 * `<ol className={CASINO_LIST}>`; the order of the list is the ranking.
 */
export const CASINO_LIST = 'flex flex-col gap-[18px]'

/**
 * A casino as a ranking row — `.ccard` in sites/microgamblin.html: the logo
 * plate, the name with its rating and the regions it accepts, the bonus on an
 * amber pill, and the two actions. On hover or keyboard focus the row lifts
 * (globals.css).
 *
 * THE TOP EDGE IS THE RANKING. `.rw` draws a green edge on every row and a
 * lime one on the first, which is how the mockup marks the leader out. The
 * mockup also prints a rank NUMBER in a disc; this network does not — no
 * casino card on any site shows one, the `<ol>` order is the ranking. `rank`
 * is still accepted so callers did not have to change.
 *
 * The logo track is a FIXED width, never `auto`: operator artwork varies from
 * square to wide banner, and an `auto` track sized itself to each image —
 * one row got an 84px logo and the next 173px, which left that row's name
 * squeezed into 139px. object-contain letterboxes inside the fixed plate.
 *
 * Four columns from 1100px; three below that (the actions take a full-width
 * row of their own); two on a phone, where the bonus also gets its own row.
 *
 * The chips carry `countries`, real attached data.
 */
export default function CasinoCard({
  casino,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const shownRegions = regions.slice(0, REGIONS_SHOWN)
  const extraRegions = regions.length - shownRegions.length

  return (
    <li className="rw grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-3 rounded-xl p-4 shadow-[0_10px_30px_-24px_rgba(30,20,48,0.35)] sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-[22px] sm:p-[22px] min-[68.75rem]:grid-cols-[180px_minmax(0,1fr)_220px] min-[68.75rem]:gap-7 min-[68.75rem]:px-7">
      {/* The logo plate. WHITE whenever there IS artwork: operator logos
          arrive with their own white ground baked in, and any other colour
          behind one shows as a hard rectangle. With no artwork the plate
          becomes the mockup's purple tile with the operator's name in amber —
          which is the only case the mockup itself ever draws. */}
      <div
        className={`flex h-[84px] items-center justify-center overflow-hidden rounded-[10px] p-2 sm:h-[100px] min-[68.75rem]:h-[116px] ${
          image ? 'border-2 border-line bg-white' : 'bg-gradient-to-br from-brand to-navy-2'
        }`}
      >
        {image ? (
          <Image src={image} alt={`${casino.name} logo`} width={320} height={200} sizes="180px" className="h-full w-full object-contain" />
        ) : (
          <span className="px-1 text-center font-display text-[15px] font-bold leading-tight text-accent [overflow-wrap:anywhere] sm:text-[18px]">
            {casino.name}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="font-display text-[21px] font-bold leading-[1.1] text-ink [overflow-wrap:anywhere] sm:text-[26px]">{casino.name}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Stars rating={casino.rating} />
            <span className="tabular-nums">{casino.rating.toFixed(1)}</span>
          </span>
          {shownRegions.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Accepts players from">
              {shownRegions.map((country) => (
                <li key={country.id} className="rounded-md bg-win-bg px-[9px] py-[3px] text-xs font-bold text-win">
                  {country.name}
                </li>
              ))}
              {extraRegions > 0 && (
                /* A count, not a tooltip: the full list is on the review
                   page, and a hover affordance is invisible on a phone. */
                <li className="rounded-md bg-surface px-[9px] py-[3px] text-xs font-bold text-ink-soft">+{extraRegions} more</li>
              )}
            </ul>
          )}
        </div>

        {/* The welcome offer on the mockup's amber pill. Dropped entirely when
            the operator has none, rather than leaving an empty pill behind. */}
        {casino.bonuses && (
          <p className="mt-2.5">
            <span className="inline-block rounded-md bg-[#eef7cf] px-3.5 py-1.5 text-[15px] font-bold leading-snug text-[#3d4f07] [overflow-wrap:anywhere] sm:text-[17px]">
              {casino.bonuses}
            </span>
          </p>
        )}
      </div>

      <div className="col-span-full grid gap-2.5 sm:grid-cols-2 min-[68.75rem]:col-span-1 min-[68.75rem]:col-start-3 min-[68.75rem]:row-start-1 min-[68.75rem]:grid-cols-1">
        <a
          href={casino.attachment.affiliate_url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="btn-or min-h-[46px] whitespace-nowrap px-4 text-[15px]"
        >
          {COPY.casinos.visitCasino}
        </a>
        <Link href={`/casinos/${casino.slug}`} className="btn-ln min-h-[46px] whitespace-nowrap px-4 text-[15px]">
          {COPY.casinos.readReview}
        </Link>
      </div>
    </li>
  )
}
