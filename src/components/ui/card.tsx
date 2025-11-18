import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("w-full max-w-md rounded-lg overflow-hidden", className)}
         style={{
           border: '1px solid rgba(255,255,255,0.1)',
           boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
         }}>
      <div className="px-6 py-4"
           style={{
             background: 'linear-gradient(90deg, #0ea5a4, #111827)',
             color: '#ffffff'
           }}>
        <div className="text-lg font-semibold">StackOverflow · Appwrite</div>
      </div>
      <div className="p-6"
           style={{
             background: '#000000',
             color: '#ffffff',
             borderTop: '1px solid rgba(255,255,255,0.1)'
           }}>
        {children}
      </div>
    </div>
  )
}

export { Card }
