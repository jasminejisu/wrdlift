export type Suggestion = {
  originalWord: string
  suggestedWord: string
  explanation?: string
}

export type Journal = {
  id: string
  content: string
  created_at?: string
  createdAtIso?: string | null
  createdAtDisplay?: string | null
  suggestions?: {
    replacements?: Suggestion[]
  }
  searchParams: Promise<{
    page?: string
    sort_by?: "created_at"
    query?: string
  }>
}
