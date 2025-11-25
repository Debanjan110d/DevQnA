"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { AnimatedGradientText } from './ui/animated-gradient-text'
import { GlitchText } from './ui/glitch-text'
import { FiSearch, FiMenu, FiX } from 'react-icons/fi'
import { useAuthStore } from '@/store/Auth'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <GlitchText trigger="hover" className="text-primary">
                Dev
              </GlitchText>
              <span className="text-white">QnA</span>
            </div>
            <AnimatedGradientText className="text-xs">
              Beta
            </AnimatedGradientText>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search questions..."
                className="pl-10 bg-gray-900/50 border-white/10"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/questions">
                  <Button variant="ghost">Questions</Button>
                </Link>
                <Link href="/tags">
                  <Button variant="ghost">Tags</Button>
                </Link>
                <Link href={`/users/${user.$id}`}>
                  <Button variant="ghost">Profile</Button>
                </Link>
                <Link href="/ask">
                  <Button>Ask Question</Button>
                </Link>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-white/10">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search questions..."
                className="pl-10 bg-gray-900/50 border-white/10"
              />
            </div>
            {user ? (
              <>
                <Link href="/questions" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Questions
                  </Button>
                </Link>
                <Link href="/tags" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Tags
                  </Button>
                </Link>
                <Link href={`/users/${user.$id}`} className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Profile
                  </Button>
                </Link>
                <Link href="/ask" className="block">
                  <Button className="w-full">Ask Question</Button>
                </Link>
                <Button variant="outline" onClick={logout} className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
