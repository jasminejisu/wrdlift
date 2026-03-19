import OpenAI from "openai"

const token = process.env.GITHUB_TOKEN

export async function getJournalSuggestions({
  journalContent,
  repeatedWords,
}: {
  journalContent: string
  repeatedWords: string[]
}) {
  const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token,
  })

  const repeatLine =
    repeatedWords && repeatedWords.length > 0
      ? `\nRepeated words detected: ${repeatedWords.join(", ")}\n`
      : ""

  const prompt = `
  You are an English teacher with over 30 years of experience teaching English to foreign learners.

Your task is to improve a student's journal entry.

Focus on:
- Repeated words
- Very basic or overused vocabulary
- Awkward or unclear wording

Suggest better word choices to make the writing clearer, more natural, and more engaging.

Return ONLY valid JSON. Format the JSON so each object in the "replacements" array appears on its own line.
Example:
{
  "replacements": [
    {"originalWord": "happy", "suggestedWord": "ecstatic", "explanation": "conveys stronger emotion"},
    {"originalWord": "hungry","suggestedWord": "starving", "explanation": "adds intensity"}
  ]
}


Journal entry:
"${journalContent}"
${repeatLine}

Return **ONLY valid JSON**
`

  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are an expert writing coach." },
      { role: "user", content: prompt },
    ],
    model: "openai/gpt-4o-mini",
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
  })

  const text = response?.choices?.[0]?.message?.content

  if (typeof text === "string") {
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }
  return text
}
