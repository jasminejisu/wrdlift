import Header from "@/components/header"
import Link from "next/link"

export default function Page() {
  return (
    <div className="landing-gradient flex min-h-screen flex-col bg-background to-indigo-100 text-foreground">
      <Header />

      <div className="decorative-blobs">
        <svg
          className="decorative-blob"
          style={{ left: "-10%", top: "-12%", width: "22rem", height: "22rem" }}
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <radialGradient id="g1" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="1" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g1)" rx="180" />
        </svg>

        <svg
          className="decorative-blob"
          style={{ right: "-8%", top: "6%", width: "28rem", height: "28rem" }}
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <radialGradient id="g2" cx="70%" cy="70%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g2)" rx="220" />
        </svg>

        <svg
          className="decorative-blob"
          style={{
            left: "30%",
            bottom: "-10%",
            width: "26rem",
            height: "26rem",
          }}
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <radialGradient id="g3" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g3)" rx="200" />
        </svg>
      </div>

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
          <div className="feature-card left rounded-lg bg-indigo-100 p-6 text-center text-foreground shadow-xl dark:bg-indigo-900/40">
            <h3 className="text-lg font-semibold">Word Count</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              See your entry&apos;s length instantly to track progress over
              time.
            </p>
          </div>

          <div className="feature-card rounded-lg bg-indigo-100 p-6 text-center text-foreground shadow-xl dark:bg-indigo-900/40">
            <h3 className="text-lg font-semibold">
              Learner-Focused Suggestions
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Receive tailored tips aimed at non-native speakers for clearer,
              more natural English.
            </p>
          </div>

          <div className="feature-card right rounded-lg bg-indigo-100 p-6 text-center text-foreground shadow-xl dark:bg-indigo-900/40">
            <h3 className="text-lg font-semibold">Tone & Grammar</h3>
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
