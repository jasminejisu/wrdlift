import Link from "next/link"
import { Button } from "./ui/button"
import { createClient } from "@/lib/auth/supabaseServer"
import LogoutButton from "./logoutButton"
import NavLinks from "./navLinks"
import Darkmode from "./darkmode"

export default async function Header() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const loggedIn = Boolean(data?.user)

  return (
    <header className="border-primary-400 sticky z-20 flex items-center justify-between border-b bg-transparent px-4 py-3 sm:px-6 md:px-8">
      <div className="flex items-center gap-4">
        <Link href={loggedIn ? "/journal" : "/"} className="text-lg font-bold">
          Wrdlift
        </Link>
        <Darkmode />
      </div>

      <div className="flex items-center gap-3">
        {!loggedIn ? (
          <>
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:underline sm:inline-block"
            >
              Log in
            </Link>
            <Button asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </>
        ) : (
          <>
            <NavLinks loggedIn={loggedIn} />
            <LogoutButton />
          </>
        )}
      </div>
    </header>
  )
}
