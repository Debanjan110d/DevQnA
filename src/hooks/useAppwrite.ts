"use client"

import { useState, useEffect, useCallback } from 'react'
import {
  getQuestions,
  getQuestionById,
  getAnswersByQuestionId,
  getVotesByTypeId,
  getCommentsByTypeId,
  getUserVote,
  calculateVoteCount,
  getStats,
  type Question,
  type Answer,
  type Vote,
  type Comment
} from '@/lib/appwrite'
import { account } from '@/models/client/config'
import { UserPrefs } from '@/store/Auth'
import { Models } from 'appwrite'

export function useQuestions(limit = 25, offset = 0) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const REQUEST_TIMEOUT_MS = 5000
  const withTimeout = async <T,>(p: Promise<T>): Promise<T> => {
    return Promise.race([
      p,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), REQUEST_TIMEOUT_MS))
    ])
  }

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true)
        const result = await withTimeout(getQuestions(limit, offset))
        setQuestions(result.documents)
        setTotal(result.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questions')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [limit, offset])

  return { questions, total, loading, error }
}

export function useQuestion(questionId: string) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const REQUEST_TIMEOUT_MS = 5000
  const withTimeout = async <T,>(p: Promise<T>): Promise<T> => {
    return Promise.race([
      p,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), REQUEST_TIMEOUT_MS))
    ])
  }

  const refetch = useCallback(async () => {
    if (!questionId) return

    try {
      setLoading(true)
      const result = await withTimeout(getQuestionById(questionId))
      setQuestion(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch question')
    } finally {
      setLoading(false)
    }
  }, [questionId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { question, loading, error, refetch }
}

export function useAnswers(questionId: string) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const REQUEST_TIMEOUT_MS = 5000
  const withTimeout = async <T,>(p: Promise<T>): Promise<T> => {
    return Promise.race([
      p,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), REQUEST_TIMEOUT_MS))
    ])
  }

  const refetch = useCallback(async () => {
    if (!questionId) return

    try {
      setLoading(true)
      const result = await withTimeout(getAnswersByQuestionId(questionId))
      setAnswers(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch answers')
    } finally {
      setLoading(false)
    }
  }, [questionId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { answers, loading, error, refetch }
}

export function useVotes(typeId: string, type: 'question' | 'answer') {
  const [votes, setVotes] = useState<Vote[]>([])
  const [userVote, setUserVote] = useState<Vote | undefined>()
  const [voteCount, setVoteCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const REQUEST_TIMEOUT_MS = 5000
  const withTimeout = async <T,>(p: Promise<T>): Promise<T> => {
    return Promise.race([
      p,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), REQUEST_TIMEOUT_MS))
    ])
  }

  const refetch = useCallback(async () => {
    if (!typeId) return

    try {
      setLoading(true)
      const votesData = await withTimeout(getVotesByTypeId(typeId, type))
      setVotes(votesData)
      setVoteCount(calculateVoteCount(votesData))

      // Get user's vote if logged in
      try {
        const user = await account.get<UserPrefs>()
        if (user) {
          const userVoteData = await withTimeout(getUserVote(typeId, type, user.$id))
          setUserVote(userVoteData)
        }
      } catch {
        // User not logged in
        setUserVote(undefined)
      }
    } catch (err) {
      console.error('Failed to fetch votes:', err)
    } finally {
      setLoading(false)
    }
  }, [typeId, type])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { votes, userVote, voteCount, loading, refetch }
}

export function useComments(typeId: string, type: 'question' | 'answer') {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const REQUEST_TIMEOUT_MS = 5000
  const withTimeout = async <T,>(p: Promise<T>): Promise<T> => {
    return Promise.race([
      p,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), REQUEST_TIMEOUT_MS))
    ])
  }

  const refetch = useCallback(async () => {
    if (!typeId) return

    try {
      setLoading(true)
      const result = await withTimeout(getCommentsByTypeId(typeId, type))
      setComments(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments')
    } finally {
      setLoading(false)
    }
  }, [typeId, type])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { comments, loading, error, refetch }
}

// Hook to get user data
export function useUser() {
  const [user, setUser] = useState<Models.User<UserPrefs> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await account.get<UserPrefs>()
        setUser(userData)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading }
}

// Hook to get author info by ID
export function useAuthor(authorId: string) {
  const [author, setAuthor] = useState<{ name: string; avatar?: string; reputation: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAuthor() {
      if (!authorId) return

      try {
        setLoading(true)
        // Try to get user from Appwrite
        try {
          const userData = await account.get<UserPrefs>()
          if (userData.$id === authorId) {
            setAuthor({
              name: userData.name,
              reputation: userData.prefs?.reputation || 0,
              avatar: userData.prefs?.avatar
            })
            return
          }
        } catch {
          // User not found or not logged in, use fallback
        }
        
        // Fallback: Use abbreviated ID as name
        setAuthor({
          name: 'User#' + authorId.substring(0, 6),
          reputation: 0,
          avatar: undefined
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAuthor()
  }, [authorId])

  return { author, loading }
}

// Hook to get platform statistics
export function useStats() {
  const [stats, setStats] = useState({ questions: 0, answers: 0, users: 0 })
  const [loading, setLoading] = useState(true)

  const REQUEST_TIMEOUT_MS = 5000
  const withTimeout = async <T,>(p: Promise<T>): Promise<T> => {
    return Promise.race([
      p,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), REQUEST_TIMEOUT_MS))
    ])
  }

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const result = await withTimeout(getStats())
      if (result.success && result.data) {
        setStats(result.data)
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { stats, loading, refetch }
}
