export default function Footer() {
  return (
    <footer className="border-t-0 bg-background/60 text-sm text-muted-foreground">
      <div className="border-t">
        <div className="container mx-auto flex flex-col items-center px-6 py-3 text-xs text-muted-foreground md:flex-row md:justify-between">
          <span>
            © {new Date().getFullYear()} WrdLift — All rights reserved.
          </span>
          <span className="mt-2 md:mt-0">
            Made with 🤎 ·{" "}
            <a className="underline" href="https://github.com/heyyyjisu">
              GitHub
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
