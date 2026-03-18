import Link from "next/link"
import { Button } from "./ui/button"
import { createClient } from "@/lib/auth/supabaseServer"
import LogoutButton from "./logoutButton"
import Image from "next/image"

export default async function Header() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const loggedIn = Boolean(data?.user)

  return (
    <header className="border-primary-400 relative z-20 flex items-center justify-between border-b bg-transparent px-4 py-3 md:px-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-lg font-bold">
          Wrdlift
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {!loggedIn ? (
          <>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:underline sm:inline-block"
            >
              Log in
            </Link>
            <Button asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </>
        ) : (
          <>
            <Link
              href="/journals"
              className="cursor-point text-xs hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50"
            >
              My journals
            </Link>
            <LogoutButton />
          </>
        )}
      </div>
    </header>
  )
}
