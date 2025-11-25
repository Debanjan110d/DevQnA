import React from 'react'
import { databases, users } from '@/models/server/config'
import { usersCollection, questionCollection, answerCollection, db } from '@/models/name'
import { Query } from 'node-appwrite'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { QuestionCard } from '@/components/QuestionCard'
import { formatDistanceToNow } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'
import { User, Question, Answer } from '@/models'

export const revalidate = 0

interface UserProfileProps {
  params: { id: string }
}

export async function generateMetadata({ params }: UserProfileProps): Promise<Metadata> {
  const { id } = params
  try {
    const user = await users.get(id)
    return {
      title: `${user.name} – DevQnA Profile`,
    }
  } catch {
    return { title: 'User Profile – DevQnA' }
  }
}

export default async function UserProfilePage({ params }: UserProfileProps) {
  const { id } = params

  // 1. Fetch User Data
  let user: User | null = null
  let joinedAt = ''
  
  try {
    // Try to get from Users collection first (richer data)
    const userDocs = await databases.listDocuments(db, usersCollection, [
      Query.equal('userId', id),
      Query.limit(1)
    ])
    
    if (userDocs.documents.length > 0) {
      user = userDocs.documents[0] as unknown as User
      joinedAt = userDocs.documents[0].$createdAt
    } else {
      // Fallback to Auth user
      const authUser = await users.get(id)
      user = {
        $id: id, // Use auth ID as fallback ID
        name: authUser.name,
        email: authUser.email,
        reputation: authUser.prefs?.reputation || 0,
        avatar: authUser.prefs?.avatar,
        bio: '',
      }
      joinedAt = authUser.$createdAt
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
            <p className="text-gray-400">The user you are looking for does not exist.</p>
            <Link href="/" className="text-primary hover:underline mt-4 block">Go Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // 2. Fetch Questions
  const questions = await databases.listDocuments(db, questionCollection, [
    Query.equal('authorId', id),
    Query.orderDesc('$createdAt'),
    Query.limit(10)
  ])

  // 3. Fetch Answers
  const answers = await databases.listDocuments(db, answerCollection, [
    Query.equal('authorId', id),
    Query.orderDesc('$createdAt'),
    Query.limit(10)
  ])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        {/* Profile Header */}
        <div className="rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-black/50 backdrop-blur-sm p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
            <Avatar 
              src={user.avatar} 
              alt={user.name} 
              fallback={user.name?.charAt(0) || '?'} 
              className="w-32 h-32 text-4xl border-4 border-black/50 shadow-2xl" 
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold text-white">{user.name}</h1>
                <Badge variant="secondary" className="text-lg px-3 py-1 bg-primary/10 text-primary border-primary/20">
                  {user.reputation || 0} Reputation
                </Badge>
              </div>
              
              <p className="text-gray-400 text-lg mb-4 max-w-2xl">
                {user.bio || "No bio provided yet."}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Member since {new Date(joinedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{questions.total}</span> questions
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{answers.total}</span> answers
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Questions Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Questions</h2>
              {questions.total > 0 && (
                <Link href={`/questions?author=${id}`} className="text-sm text-primary hover:underline">
                  View all
                </Link>
              )}
            </div>
            
            {questions.documents.length > 0 ? (
              <div className="space-y-4">
                {questions.documents.map((question) => (
                  <QuestionCard
                    key={question.$id}
                    id={question.$id}
                    title={(question as unknown as Question).title}
                    content={(question as unknown as Question).content}
                    authorId={(question as unknown as Question).authorId}
                    tags={(question as unknown as Question).tags || []}
                    createdAt={question.$createdAt}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-xl border border-white/5 bg-white/5">
                <p className="text-gray-400">No questions asked yet.</p>
              </div>
            )}
          </div>

          {/* Answers Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Answers</h2>
            </div>
            
            {answers.documents.length > 0 ? (
              <div className="space-y-4">
                {answers.documents.map((answer) => (
                  <div 
                    key={answer.$id}
                    className="group relative p-6 rounded-xl border border-white/10 bg-linear-to-br from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="mb-4">
                      <Link href={`/questions/${(answer as unknown as Answer).questionId}`} className="text-lg font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">
                        Answer to Question
                      </Link>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(answer.$createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                      {(answer as unknown as Answer).content.replace(/[#*`]/g, '')}
                    </p>
                    
                    <Link 
                      href={`/questions/${(answer as unknown as Answer).questionId}`}
                      className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      View Answer →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-xl border border-white/5 bg-white/5">
                <p className="text-gray-400">No answers posted yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
