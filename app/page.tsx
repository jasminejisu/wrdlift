import Link from "next/link"

export default function Page() {
  return (
    <div className="landing-gradient flex h-full min-h-screen w-full flex-col bg-background to-indigo-100 text-foreground">
      <main className="relative z-10 container mx-auto flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="hero-gradient-text text-4xl font-extrabold sm:text-5xl">
            Wrdlift
          </h1>
          <p className="mt-3 text-2xl font-semibold sm:text-3xl">
            Improve your English through journaling
          </p>

          <p className="mt-4 text-lg text-muted-foreground">
            Write a quick entry each day and see your word count instantly. Get
            friendly, learner-focused suggestions to make your writing clearer,
            more natural, and more confident.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xl hover:bg-primary/90"
            >
              Get started — it&apos;s free
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-xl hover:bg-muted"
            >
              Log in
            </Link>
          </div>
        </section>

        <section className="grid gap-8 sm:grid-cols-3">
          <div className="feature-card left dark:bg-card40 rounded-lg bg-card p-6 text-center text-foreground shadow-xl">
            <h3 className="text-lg font-semibold">🧮 Word Count</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              See your entry&apos;s length instantly to track progress over
              time.
            </p>
          </div>

          <div className="feature-card rounded-lg bg-card p-6 text-center text-foreground shadow-xl dark:bg-card">
            <h3 className="text-lg font-semibold">
              🪄 Learner-Focused Suggestions
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Receive tailored tips aimed at non-native speakers for clearer,
              more natural English.
            </p>
          </div>

          <div className="feature-card right rounded-lg bg-card p-6 text-center text-foreground shadow-xl dark:bg-card">
            <h3 className="text-lg font-semibold">✍🏼 Tone & Grammar</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get corrections and tone advice so your writing matches the
              intent.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
