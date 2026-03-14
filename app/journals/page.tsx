import Header from "@/components/header"
import { JournalForm } from "@/components/journalForm"
import { createClient } from "@/lib/auth/supabaseServer"
import { redirect } from "next/navigation"

export default async function JournalsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data) {
    redirect("/login")
  }

  return (
    <div className="landing-gradient min-h-screen bg-background text-foreground">
      <Header />

      <div className="decorative-blobs" aria-hidden />

      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="hero-gradient-text mb-6 text-3xl font-extrabold">
            Your Journal
          </h1>

          <div className="feature-card rounded-lg bg-indigo-50 p-6 shadow-xl dark:bg-indigo-900/40">
            <JournalForm />
          </div>
        </div>
      </main>
    </div>
  )
}
