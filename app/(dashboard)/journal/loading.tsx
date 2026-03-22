import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="relative z-10 mx-auto mt-20 flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-20">
      <div className="feature-card rounded-lg bg-card p-6 shadow-xl dark:bg-card">
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Spinner />
            </EmptyMedia>
            <EmptyTitle>Saving your journal</EmptyTitle>
            <EmptyDescription>
              <p>Please wait while we save your journal 🤎</p>
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </div>
  )
}
