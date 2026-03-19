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
      const entry = data.data?.[0]?.content || ""
      setSavedEntry(entry)

      const repeatedWords = getRepeatWords(entry)

      const aiRes = await fetch("/api/users/journals/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journalContent: entry,
          repeatedWords: repeatedWords.map((rw) => rw.word),
        }),
      })

      if (!aiRes.ok) {
        console.error("Ai response failed.")
      } else {
        const aiData = await aiRes.json()
        let replacements: {
          originalWord: string
          suggestedWord: string
          explanation: string
        }[] = []
        if (typeof aiData.suggestions === "string") {
          try {
            const parsed = JSON.parse(aiData.suggestions)
            replacements = parsed.replacements || []
          } catch (err) {
            toast.error("Failed to suggest improvements.")
          }
        } else if (aiData.suggestions?.replacements) {
          replacements = aiData.suggestions.replacements
        }
        setSuggetions(replacements)
      }

      setContent("")
    } catch (err) {
      console.error(err)
      toast.error("Log in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const countedWords = countWords(savedEntry)
  const repeatedWords = getRepeatWords(savedEntry)

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
              savedEntry || (
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
              Word counter: {countedWords} words
              <CardDescription>
                Repeated words:{" "}
                {repeatedWords.length > 0
                  ? repeatedWords.map((rw) => rw.word).join(", ")
                  : "None"}
              </CardDescription>
            </CardHeader>
          )}

          {savedEntry && !isLoading && (
            <CardContent>
              <CardDescription>Want to make it even better?</CardDescription>
              <ul>
                {suggestions.map((item, idx) => (
                  <li key={idx} className="mb-2">
                    <strong>
                      [{item.originalWord}]→{item.suggestedWord}
                    </strong>
                    : {item.explanation}
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
