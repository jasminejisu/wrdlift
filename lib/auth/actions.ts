import { SupabaseClient } from "@supabase/supabase-js"

type SaveEntryProps = {
  content: string
  userId: string
}

export async function saveEntry(
  supabase: SupabaseClient,
  { content, userId }: SaveEntryProps
) {
  return await supabase
    .from("journals")
    .insert({ content, user_id: userId })
    .select()
}

export async function getJournals<T = unknown>(
  supabase: SupabaseClient,
  userId: string,
  {
    page = 1,
    pageSize = 8,
    sortBy,
    query,
  }: {
    page?: number
    pageSize?: number
    sortBy?: "created_at"
    query?: string
  } = {}
) {
  const p = Math.max(1, page)
  const start = (p - 1) * pageSize
  const end = start + pageSize - 1

  const res = await supabase
    .from("journals")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(start, end)

  const { data, error, count } = res
  if (error) {
    throw error
  }
  const pageCount = count ? Math.ceil(count / pageSize) : 0
  return { data, count, pageCount, pageSize }
}

export async function deleteJournals(
  supabase: SupabaseClient,
  userId: string,
  ids: string[],
  {
    page = 1,
    pageSize = 8,
  }: {
    page?: number
    pageSize?: number
  } = {}
) {
  if (!ids || ids.length === 0)
    return { deleteCount: 0, remainingCount: 0, pageCount: 0 }

  const { data: deleted, error: deleteError } = await supabase
    .from("journals")
    .delete()
    .eq("user_id", userId)
    .in("id", ids)
    .select()

  if (deleteError) {
    throw deleteError
  }

  const deleteCount = (deleted ?? []).length

  const res = await supabase
    .from("journals")
    .select("id", { count: "exact" })
    .eq("user_id", userId)

  const { error, count: remainingCount } = res

  if (error) {
    throw error
  }
  const pageCount = remainingCount ? Math.ceil(remainingCount / pageSize) : 0
  return { deleteCount, pageCount, remainingCount }
}
