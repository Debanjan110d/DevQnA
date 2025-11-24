"use client"

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/Auth'
import { createOrUpdateVote, deleteVote, calculateVoteCount, getUserVote, getVotesByTypeId } from '@/lib/appwrite'

interface VoteButtonsProps {
  id: string
  type: 'question' | 'answer'
  initialVoteCount?: number
}

export function VoteButtons({
  id,
  type,
  initialVoteCount = 0,
}: VoteButtonsProps) {
  const { session } = useAuthStore()
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [userVote, setUserVote] = useState<'upvoted' | 'downvoted' | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (voteType: 'upvoted' | 'downvoted') => {
    if (!session) {
      alert('Please log in to vote')
      return
    }

    if (isVoting) return

    setIsVoting(true)

    try {
      const result = await createOrUpdateVote({
        typeId: id,
        type,
        votedById: session.$id,
        voteStatus: voteType
      })

      if (result.success) {
        if (userVote === voteType) {
          setUserVote(null)
        } else {
          setUserVote(voteType)
        }
        setVoteCount(result.data.voteResult)
      }
    } catch {
      alert('Failed to vote. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  // Load user's existing vote on mount
  useEffect(() => {
    if (!session) return
    
    async function loadUserVote() {
      if (!session) return
      
      try {
        const vote = await getUserVote(id, type, session.$id)
        if (vote) {
          setUserVote(vote.voteStatus)
        }
      } catch {
        // Silent fail
      }
    }
    
    loadUserVote()
  }, [session, id, type])

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Upvote Button */}
      <button
        onClick={() => handleVote('upvoted')}
        disabled={isVoting || !session}
        className={`group p-2 rounded-lg transition-all duration-200 ${
          userVote === 'upvoted'
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-primary/10 text-gray-400 hover:text-primary'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="This question shows research effort; it is useful and clear"
      >
        <svg
          className={`w-8 h-8 transition-transform duration-200 ${
            userVote === 'upvoted' ? 'scale-110' : 'group-hover:scale-110'
          }`}
          fill={userVote === 'upvoted' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={userVote === 'upvoted' ? 0 : 2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      {/* Vote Count */}
      <div
        className={`text-2xl font-bold transition-colors duration-200 ${
          voteCount > 0 ? 'text-green-500' : voteCount < 0 ? 'text-red-500' : 'text-white'
        }`}
      >
        {voteCount > 0 ? `+${voteCount}` : voteCount}
      </div>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote('downvoted')}
        disabled={isVoting || !session}
        className={`group p-2 rounded-lg transition-all duration-200 ${
          userVote === 'downvoted'
            ? 'bg-red-500/20 text-red-500'
            : 'hover:bg-red-500/10 text-gray-400 hover:text-red-500'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="This question does not show any research effort; it is unclear or not useful"
      >
        <svg
          className={`w-8 h-8 transition-transform duration-200 ${
            userVote === 'downvoted' ? 'scale-110' : 'group-hover:scale-110'
          }`}
          fill={userVote === 'downvoted' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={userVote === 'downvoted' ? 0 : 2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  )
}
