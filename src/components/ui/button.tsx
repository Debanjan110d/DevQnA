"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline"
}

function Button({ className, variant = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none"

  if (variant === "outline") {
    return (
      <button
        {...props}
        className={cn(base, "border border-border bg-transparent text-foreground", className)}
      />
    )
  }

  if (variant === "ghost") {
    return (
      <button
        {...props}
        className={cn(base, "bg-transparent", className)}
      />
    )
  }

  // default primary button uses CSS variables so it renders without extra Tailwind utilities
  const style: React.CSSProperties = {
    background: 'var(--primary)',
    color: 'var(--primary-foreground)'
  }

  return (
    <button
      {...props}
      style={style}
      className={cn(base, className)}
    />
  )
}

export { Button }
