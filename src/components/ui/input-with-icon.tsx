"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

function InputWithIcon({ icon, className, style, ...props }: { icon?: React.ReactNode } & React.ComponentProps<typeof Input>) {
  return (
    <div className={cn("relative", className)}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2"
             style={{ color: '#94a3b8' }}>
          {icon}
        </div>
      )}
      <Input 
        {...(props as any)} 
        className={cn(icon ? "pl-10" : "pl-3")} 
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#ffffff',
          ...style
        }}
      />
    </div>
  )
}

export { InputWithIcon }
