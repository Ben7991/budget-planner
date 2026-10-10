"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "cn"
import { Button } from "@repo/components/atoms/button"
import { TextField } from "@repo/components/molecules/text-field"

function PasswordField({
  label = "Password",
  className,
  ...props
}: Omit<React.ComponentProps<typeof TextField>, "type">) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="grid gap-2">
      <div className="relative">
        <TextField
          label={label}
          type={visible ? "text" : "password"}
          className={cn("pr-10", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-7 right-1"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    </div>
  )
}

export { PasswordField }
