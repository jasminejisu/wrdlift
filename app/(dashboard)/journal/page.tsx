import { JournalForm } from "@/components/journalForm"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/auth/supabaseServer"
import { redirect } from "next/navigation"

export default async function JournalPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data) {
    redirect("/login")
  }

  return (
    <div className="landing-gradient min-h-screen bg-background text-foreground">
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="mx-auto w-full max-w-full md:max-w-6xl">
          <h1 className="hero-gradient-text mb-6 text-3xl font-extrabold">
            Your Journal
          </h1>

          <div className="feature-card rounded-lg bg-card p-6 shadow-xl dark:bg-card">
            <JournalForm />
          </div>
        </div>
      </main>
    </div>
  )
}
