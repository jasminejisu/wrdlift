"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavLinks({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname() ?? "/"

  if (!loggedIn) return null

  const linkClass =
    "cursor-pointer text-xs hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50"

  if (pathname === "/journals") {
    return (
      <Link href="journal" className={linkClass}>
        Add journal
      </Link>
    )
  }

  return (
    <Link href="/journals" className={linkClass}>
      My journals
    </Link>
  )
}
