"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState<string>("")
  const [emailInvalid, setEmailInvalid] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [passwordInvalid, setPasswordInvalid] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    if (!email || !isValidEmail(email)) {
      setEmailInvalid(true)
    }
    if (!password || password.length < 8) {
      setPasswordInvalid(true)
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    console.log(data)
    if (!data.success) {
      toast.error("No user found. Please sign up.")
    }
    if (data.success) {
      router.push("/journals")
    } else {
      toast.error("Log in failed. Please try again.")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailInvalid) setEmailInvalid(false)
                  }}
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  disabled={isLoading}
                />
                {emailInvalid ? (
                  <FieldDescription className="text-red-800">
                    Please provide valid email.
                  </FieldDescription>
                ) : (
                  ""
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordInvalid) setPasswordInvalid(false)
                  }}
                  id="password"
                  type="password"
                  min={8}
                  disabled={isLoading}
                />
                {passwordInvalid ? (
                  <FieldDescription className="text-red-800">
                    Password must be at least 8 characters.
                  </FieldDescription>
                ) : (
                  ""
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner /> : "Login"}
                </Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
