import { getJournalSuggestions } from "@/lib/ai/openAi"

export async function POST(request: Request) {
  try {
    const { journalContent, repeatedWords } = await request.json()
    const suggestions = await getJournalSuggestions({
      journalContent,
      repeatedWords,
    })
    return Response.json({ suggestions })
  } catch (err) {
    console.error("Ai error:", err)
    return Response.json({ suggestions: "Suggestion unavailable." })
  }
}
