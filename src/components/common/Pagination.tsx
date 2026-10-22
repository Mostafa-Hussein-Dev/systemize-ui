import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '../ui/button'

/**
 * Prev/next pager with a "Page X of Y (N total)" summary, driven by typical
 * backend pagination meta. Renders nothing when there's a single page, so
 * callers can drop it in unconditionally.
 *
 * i18n-agnostic by design: pass `prevLabel`, `nextLabel` and `summary` (a
 * function of the paging info) to localise it — in an i18next app that's just
 * `prevLabel={t('pagination.prev')}` etc. The English defaults keep it usable
 * with zero wiring.
 */
export function Pagination({
  page,
  totalPages,
  total,
  onPrev,
  onNext,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  summary = ({ page, totalPages, total }) =>
    `Page ${page} of ${totalPages} (${total} total)`,
}: {
  page: number
  totalPages: number
  total: number
  onPrev: () => void
  onNext: () => void
  prevLabel?: string
  nextLabel?: string
  summary?: (info: {
    page: number
    totalPages: number
    total: number
  }) => string
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between text-sm text-text-secondary">
      <span>{summary({ page, totalPages, total })}</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={onPrev}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
          {prevLabel}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={onNext}
        >
          {nextLabel}
          <ChevronRight className="size-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  )
}
