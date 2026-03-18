"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import type { Journal } from "@/lib/types/journal"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alertDialog"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function MyJournals({
  initialJournals = [],
  page,
  pageCount,
  pageSize,
}: {
  initialJournals?: Journal[]
  page: number
  pageCount: number
  pageSize: number
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Journal | null>(null)

  const router = useRouter()

  function truncate(text?: string) {
    if (!text) return ""
    return text.length > 44 ? text.slice(0, 44) + "..." : text
  }

  function toggleCheckbox(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const allSelected =
    initialJournals.length > 0 && selectedIds.size === initialJournals.length
  const someSelected =
    selectedIds.size > 0 && selectedIds.size < initialJournals.length

  function toggleSelectAll() {
    setSelectedIds((prev) =>
      prev.size === initialJournals.length
        ? new Set()
        : new Set(initialJournals.map((j) => j.id))
    )
  }

  async function onDelete(ids: string[]) {
    setIsLoading(true)
    ids.every((id) => typeof id === "string")
    const res = await fetch("/api/users/journals/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, pageSize, ids }),
    })
    const data = await res.json()
    setIsLoading(false)
    if (!data.success) {
      toast.error("Failed to delete journal")
      return
    }
    const { deleteCount, remainingCount, remainingPageCount } = data
    toast.success(`${deleteCount} journal(s) deleted`)

    if (remainingPageCount === 0) {
      router.push(`?page=1&pageSize=${pageSize}`)
      return
    }
    if (page > remainingPageCount) {
      router.push(`?page=${remainingPageCount}&pageSize=${pageSize}`)
      return
    }
    setSelectedIds(new Set())
    router.refresh()
  }

  function onClickContent(e: React.MouseEvent, j: Journal) {
    e.stopPropagation()
    setActive(j)
    setOpen(true)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-30">
            <div className="flex items-center gap-2.5">
              <Checkbox
                className="ml-1.5"
                checked={
                  allSelected ? true : someSelected ? "indeterminate" : false
                }
                onCheckedChange={() => toggleSelectAll()}
              />
              Select/All
            </div>
          </TableHead>

          <TableHead>Content</TableHead>
          <TableHead className="w-36 text-left">Date</TableHead>
          <TableHead className="w-16 text-right">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex items-center justify-end gap-2">
                  Delete selected
                  <Button
                    variant="destructive"
                    size="icon"
                    className="size-8"
                    disabled={selectedIds.size === 0}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure deleting selected journals?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your journals from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(Array.from(selectedIds))}
                    disabled={selectedIds.size === 0 || isLoading}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {initialJournals.map((j) => {
          const shown = truncate(j.content)
          return (
            <TableRow key={j.id}>
              <TableCell className="w-30">
                <Checkbox
                  className="ml-1.5"
                  checked={selectedIds.has(j.id)}
                  onCheckedChange={(val) => toggleCheckbox(j.id, Boolean(val))}
                />
              </TableCell>
              <TableCell className="min-w-0 font-medium">
                <div className="truncate">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          onClickContent(e, j)
                        }}
                      >
                        {shown}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{shown}</DialogTitle>
                        <DialogDescription>
                          Saved date{" "}
                          {j.createdAtIso ? (
                            <time dateTime={j.createdAtIso}>
                              {" "}
                              {j.createdAtDisplay ??
                                `${new Date(j.createdAtIso).toLocaleDateString("en-GB")} at ${new Date(j.createdAtIso).toLocaleTimeString("en-GB", { hour12: false })}`}{" "}
                            </time>
                          ) : (
                            "-"
                          )}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                        <p className="mb-4 leading-normal">{active?.content}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
              <TableCell className="w-36">
                {j.createdAtIso ? (
                  <time dateTime={j.createdAtIso}>
                    {" "}
                    {j.createdAtDisplay ??
                      `${new Date(j.createdAtIso).toLocaleDateString("en-GB")} at ${new Date(j.createdAtIso).toLocaleTimeString("en-GB", { hour12: false })}`}{" "}
                  </time>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="w-12 text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="size-8"
                    >
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure deleting the journal?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your journal from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete([j.id])}
                        disabled={isLoading}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
