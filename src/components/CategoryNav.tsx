import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { Category } from '@shared/types/category'

/**
 * MicroGamblin category tabs, from sites/microgamblin.html (`.tabs`/`.tab`):
 * squared white tabs with the casino count beside the label, the current
 * category filled green with its count in lime.
 *
 * A self-sizing grid — `auto-fill, minmax(170px, 1fr)` — so the tabs fill the
 * row at every width and wrap onto the next line rather than scrolling off.
 *
 * The tabs NAVIGATE rather than filter in place: always the canonical
 * /categories/<slug> route. The query forms (`/?category=`,
 * `/casinos?category=`) are 301'd to it at the edge (lib/seo/redirects.ts), so
 * linking either would spend a redirect per visitor and crawl budget on URLs
 * that resolve elsewhere.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav aria-label="Casino categories">
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]" role="list">
        {categories.map((c) => {
          const active = c.slug === selected
          return (
            <li key={c.id}>
              <Link
                href={`/categories/${c.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`tab flex min-h-[52px] w-full items-center gap-2.5 rounded-lg border px-[18px] text-[15px] font-semibold ${
                  active ? 'border-brand bg-brand text-white' : 'border-line bg-paper text-ink'
                }`}
              >
                {/* The category's own icon, as in the Casinos menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {c.logo_path && (
                  <img src={resolveImageUrl(c.logo_path)!} alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
                )}
                <span className="min-w-0 truncate">{c.name}</span>
                {typeof c.casinos_count === 'number' && (
                  <span className={`ml-auto text-[12.5px] font-bold ${active ? 'text-accent' : 'text-muted'}`}>{c.casinos_count}</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
