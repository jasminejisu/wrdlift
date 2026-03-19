import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Props = { page: number; pageCount: number; pageSize: number }

export function PaginationSimple({ page, pageCount, pageSize }: Props) {
  if (!pageCount || pageCount <= 1) return null
  const maxButtons = 3
  const half = Math.floor(maxButtons / 2)
  const start = Math.max(
    1,
    Math.min(page - half, Math.max(1, pageCount - maxButtons + 1))
  )
  const end = Math.min(pageCount, start + maxButtons - 1)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="feature-card mt-2 rounded-lg border border-muted bg-card p-2 shadow-xl dark:bg-card">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {page === 1 ? (
              ""
            ) : (
              <PaginationPrevious
                href={page > 1 ? `?page=${page - 1}&pageSize=${pageSize}` : "#"}
              />
            )}
          </PaginationItem>

          {start > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href={`?page=1&pageSize=${pageSize}`}
                  isActive={1 === page}
                >
                  <PaginationEllipsis />
                </PaginationLink>
              </PaginationItem>
              {start > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href={`?page=${p}&pageSize=${pageSize}`}
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {end < pageCount && (
            <>
              {end < pageCount - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href={`?page=${pageCount}&pageSize=${pageSize}`}
                  isActive={pageCount === page}
                >
                  <PaginationEllipsis />
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationNext
              href={
                page < pageCount
                  ? `?page=${page + 1}&pageSize=${pageSize}`
                  : "#"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
