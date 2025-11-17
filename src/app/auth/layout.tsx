"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/Auth"

const Layout = ({ children }: { children: React.ReactNode }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = useAuthStore((s: any) => s.session)
    const router = useRouter()

    // If the user IS authenticated, redirect them away from auth routes
    // (login/register) to the app root. Allow unauthenticated users to
    // view these pages.
    useEffect(() => {
        if (session) {
            router.push("/")
        }
    }, [session, router])

    // While redirecting, don't render the auth UI.
    if (session) return null

    return (
        <div className="h-screen">
            {children}
        </div>
    )
}

export default Layout
