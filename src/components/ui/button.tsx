"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline"
}

function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
        variant === "default" && "bg-primary text-primary-foreground hover:brightness-95",
        variant === "outline" && "border border-border bg-transparent text-foreground hover:bg-muted/5",
        variant === "ghost" && "bg-transparent hover:bg-muted/5",
        className
      )}
    />
  )
}

export { Button }
