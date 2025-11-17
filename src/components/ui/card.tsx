import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("w-full max-w-md rounded-lg overflow-hidden shadow-lg", className)}>
      <div className="px-6 py-4 bg-gradient-to-r from-primary to-secondary">
        <div className="text-white text-lg font-semibold">StackOverflow · Appwrite</div>
      </div>
      <div className={cn("border border-border bg-card p-6 text-card-foreground", className)}>
        {children}
      </div>
    </div>
  )
}

export { Card }
