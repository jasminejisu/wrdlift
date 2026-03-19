"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Field, FieldGroup } from "./ui/field"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"
import { createClient } from "@/lib/auth/supabase"
import { Skeleton } from "./ui/skeleton"
import { highlightText } from "@/lib/highlight"

export function JournalForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [content, setContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [savedEntry, setSavedEntry] = useState<string>("")
  const [suggestions, setSuggetions] = useState<
    { originalWord: string; suggestedWord: string; explanation: string }[]
  >([])

  function getRepeatWords(text: string): { word: string; count: number }[] {
    if (!text) return []
    const words = text.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const counts: Record<string, number> = {}
    words.forEach((w) => {
      counts[w] = (counts[w] || 0) + 1
    })
    return Object.entries(counts)
      .filter(([_, count]) => count > 1)
      .map(([word, count]) => ({ word, count: count as number }))
  }

  function countWords(text: string) {
    if (!text) return 0
    return text.trim().split(/\s+/).filter(Boolean).length
  }

  async function onSave(e: React.FormEvent<HTMLElement>) {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!content) {
        toast.error("Please enter your journal")
        return
      }

      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      const res = await fetch("/api/users/journals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
      })

      const data = await res.json()

      if (!data.success) {
        toast.error("Failed to save the entry")
        return
      }

      toast.success("Journal saved successfully")

      const entry = data.data?.[0]
      setSavedEntry(entry?.content || "")
      setSuggetions(
        entry?.suggestions?.replacements || entry?.suggestions || []
      )

      setContent("")
    } catch (err) {
      console.error(err)
      toast.error("Log in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const liveRepeated = getRepeatWords(content)
  const repeatedWords = getRepeatWords(savedEntry)
  const liveCounted = countWords(content)
  const countedWords = countWords(savedEntry)

  return (
    <div className="flex flex-col gap-6 lg:flex-row" {...props}>
      <div className="flex-1">
        <FieldGroup className="w-full">
          <Field>
            {isLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="box-border min-h-100 w-full rounded-md p-2" />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Today...</CardTitle>
                  <CardDescription>
                    Write about your day, your thoughts, your feelings, or
                    something that inspired you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <form onSubmit={onSave}>
                      <Field>
                        <Textarea
                          className="min-h-100 w-full"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? <Spinner /> : "Save"}
                        </Button>
                      </Field>
                    </form>
                  </FieldGroup>
                </CardContent>
              </Card>
            )}
          </Field>
        </FieldGroup>
      </div>

      <div className="w-full space-y-4 lg:w-80">
        <Card className={savedEntry && !isLoading ? "bg-accent" : ""}>
          <CardContent className="min-h-36">
            {isLoading ? (
              <Skeleton className="box-border min-h-93 w-full rounded-md p-2" />
            ) : (
              highlightText(savedEntry, suggestions) || (
                <p className="text-muted-foreground">No journal yet</p>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          {isLoading ? (
            <Button
              variant="secondary"
              disabled
              size="lg"
              className="mr-3 ml-3"
            >
              <Spinner data-icon="inline-start" />
              Processing
            </Button>
          ) : (
            <CardHeader>
              Word counter:{" "}
              {content.trim().length > 0 ? liveCounted : countedWords} words
              <CardDescription>
                Repeated words:{" "}
                {savedEntry && !isLoading
                  ? repeatedWords.length
                    ? repeatedWords.map((r) => r.word).join(", ")
                    : "None"
                  : liveRepeated.length
                    ? liveRepeated.map((r) => r.word).join(", ")
                    : "None"}
              </CardDescription>
            </CardHeader>
          )}

          {savedEntry && !isLoading && (
            <CardContent>
              <CardDescription className="text-primary-background">
                Want to make it even better?
              </CardDescription>
              <ul>
                {suggestions.map((s, i) => (
                  <li key={i} className="flex flex-col items-start gap-2 p-2">
                    <div className="w-full border-b border-border bg-transparent p-2 hover:bg-muted/50">
                      <div className="font-medium">
                        {s.originalWord} 🔍 {s.suggestedWord}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.explanation}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
