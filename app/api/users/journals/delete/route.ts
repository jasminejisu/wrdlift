import { deleteJournals } from "@/lib/auth/actions"
import { createClient } from "@/lib/auth/supabaseServer"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { page, pageSize, ids } = await request.json()
  const supabase = await createClient()

  const isArray = Array.isArray(ids)
  if (!isArray || ids.length === 0) {
    return NextResponse.json(
      { success: false, message: "invalid ids" },
      { status: 400 }
    )
  }
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const { deleteCount, remainingCount, pageCount } = await deleteJournals(
      supabase,
      data.user.id,
      ids,
      { page: 1, pageSize: 8 }
    )
    return NextResponse.json({
      success: true,
      deleteCount,
      remainingCount,
      pageCount,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message ?? "Server error" },
      { status: 500 }
    )
  }
}
