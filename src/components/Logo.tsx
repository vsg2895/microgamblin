import Link from 'next/link'

/**
 * MicroGamblin brand mark, from sites/microgamblin.html: a squared green tile
 * holding a stack of chips that steps DOWN from left to right — the small
 * stake the name is about — with the tallest chip picked out in lime. Then the
 * wordmark, "Gamblin" in the brand green, over a spaced-capital tagline.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra request
 * and stays crisp at any size. The artwork is aria-hidden; the Link's name is
 * its visible text.
 *
 * `onDark` is for the dark footer and the green hero: the tile steps to the
 * deepest green so it still reads as a tile, and the wordmark turns white with
 * the second half in lime, the one colour that holds up on that ground. One
 * component, so the header's mark and the footer's can never drift apart.
 */
export default function Logo({
  className = '',
  onDark = false,
}: {
  className?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-navy' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      <svg viewBox="0 0 42 42" className="h-[40px] w-[40px] shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
        <rect width="42" height="42" rx="9" fill={onDark ? 'var(--color-navy-2)' : 'var(--color-brand)'} />
        {/* Three stacks, stepping down to the right: the stake getting
            smaller. The tallest is lime; the rest read as its shadow. */}
        <rect x="9" y="13" width="7" height="20" rx="2" fill="var(--color-accent)" />
        <rect x="18.5" y="19" width="7" height="14" rx="2" fill="#ffffff" opacity="0.85" />
        <rect x="28" y="25" width="7" height="8" rx="2" fill="#ffffff" opacity="0.55" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className={`font-display text-[20px] font-bold tracking-[-0.03em] sm:text-[22px] ${onDark ? 'text-white' : 'text-ink'}`}>
          Micro<span className={onDark ? 'text-accent' : 'text-brand'}>Gamblin</span>
        </span>
        <span className={`mt-[5px] text-[10.5px] font-semibold uppercase tracking-[0.2em] ${onDark ? 'text-night-muted' : 'text-muted'}`}>
          Low-stakes casino reviews
        </span>
        {/* The link's name is its visible text plus this — no aria-label that
            could disagree with what is on screen. */}
        <span className="sr-only"> home</span>
      </span>
    </Link>
  )
}
