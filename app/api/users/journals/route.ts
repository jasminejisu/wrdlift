import { getJournalSuggestions } from "@/lib/ai/openAi"
import { getJournals, saveEntry } from "@/lib/auth/actions"
import { createClient } from "@/lib/auth/supabaseServer"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { content } = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    )
  }

  const text = content.trim().toLowerCase()
  const words: string[] = text.length
    ? text
        .split(/\s+/)
        .filter((s: string | unknown[]): s is string => s.length > 0)
    : []

  const counts: Record<string, number> = {}
  for (const w of words) {
    counts[w] = (counts[w] ?? 0) + 1
  }
  const repeatedWords = Object.entries(counts)
    .filter(([, c]) => c > 1)
    .map(([w]) => w)

  let suggestions: unknown = null

  try {
    const airesult = await getJournalSuggestions({
      journalContent: content,
      repeatedWords,
    })
    if (typeof airesult === "string") {
      try {
        suggestions = JSON.parse(airesult)
      } catch {
        suggestions = airesult
      }
    } else {
      suggestions = airesult
    }
  } catch (aiErr) {
    console.error("AI suggestions failed:", aiErr)
  }

  const normalizedSuggestions =
    suggestions && typeof suggestions === "object"
      ? {
          replacements: Array.isArray(
            (suggestions as Record<string, unknown>).replacements
          )
            ? (suggestions as Record<string, unknown>).replacements
            : [],
          ...suggestions,
        }
      : { replacements: [] }

  const { data: entryData, error: saveError } = await saveEntry(supabase, {
    content,
    userId: data.user.id,
    suggestions: normalizedSuggestions,
  })
  if (saveError) {
    return NextResponse.json(
      { success: false, error: saveError, message: saveError.message },
      { status: 500 }
    )
  }
  console.log(entryData)
  return NextResponse.json({ success: true, data: entryData })
}

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  try {
    const { data: journals, count } = await getJournals(supabase, data.user.id)
    return NextResponse.json({ seccess: true, data: journals, count })
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 })
  }
}
