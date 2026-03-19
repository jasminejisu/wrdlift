import { JSX } from "react"

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function highlightText(
  text: string,
  replacements: {
    originalWord: string
    suggestedWord: string
    explanation?: string
  }[]
) {
  if (!replacements.length) return text
  const patterns = replacements
    .map((r) => escapeRegExp(r.originalWord))
    .join("|")
  const re = new RegExp(`\\b(${patterns})\\b`, "gi")
  const parts: Array<string | JSX.Element> = []
  let lastIndex = 0
  text.replace(re, (match, _p1, offset) => {
    parts.push(text.slice(lastIndex, offset))
    const replacement = replacements.find(
      (r) => r.originalWord.toLowerCase() === match.toLowerCase()
    )
    parts.push(
      <mark
        key={offset}
        title={replacement?.explanation}
        className="rounded bg-amber-300 px-0.5"
      >
        {match}
      </mark>
    )
    lastIndex = offset + match.length
    return match
  })
  parts.push(text.slice(lastIndex))
  return parts
}
