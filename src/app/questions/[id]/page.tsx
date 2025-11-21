"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { VoteButtons } from '@/components/VoteButtons'
import { Answers } from '@/components/Answers'
import { Comments } from '@/components/Comments'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { AnimatedCardReveal } from '@/components/ui/animated-card-reveal'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuestion, useAuthor, useVotes, useAnswers } from '@/hooks/useAppwrite'
import { updateQuestion, deleteQuestion, getAttachmentUrl } from '@/lib/appwrite'
import { useAuthStore } from '@/store/Auth'
import { formatDistanceToNow } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

const RTE = dynamic(() => import('@/components/RTE'), { ssr: false })
const Markdown = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown!),
  { ssr: false }
)

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string
  const { session } = useAuthStore()
  
  const { question, loading: questionLoading, error: questionError, refetch } = useQuestion(questionId)
  const { author, loading: authorLoading } = useAuthor(question?.authorId || '')
  const { voteCount } = useVotes(questionId, 'question')
  const { answers } = useAnswers(questionId)

  const [showComments, setShowComments] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editTags, setEditTags] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isAuthor = session?.$id === question?.authorId

  const handleEdit = () => {
    if (question) {
      setEditTitle(question.title)
      setEditContent(question.content)
      setEditTags(question.tags.join(', '))
      setIsEditing(true)
    }
  }

  const handleUpdate = async () => {
    if (!editTitle.trim() || !editContent.trim()) return

    setIsUpdating(true)
    try {
      const tags = editTags.split(',').map(t => t.trim()).filter(t => t)
      const result = await updateQuestion(questionId, {
        title: editTitle.trim(),
        content: editContent.trim(),
        tags
      })
      if (result.success) {
        setIsEditing(false)
        refetch()
      }
    } catch (error) {
      console.error('Failed to update question:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) return

    setIsDeleting(true)
    try {
      const result = await deleteQuestion(questionId)
      if (result.success) {
        router.push('/')
      }
    } catch (error) {
      console.error('Failed to delete question:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (questionLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
        <Footer />
      </div>
    )
  }

  if (questionError || !question) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Question not found</h2>
            <p className="text-gray-400">The question you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/" className="text-primary hover:underline mt-4 inline-block">
              ← Back to Questions
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Main Content */}
          <main className="space-y-6">
            <AnimatedCardReveal direction="top">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Asked {formatDistanceToNow(question.$createdAt)}</span>
                  <span>•</span>
                  <span>Viewed 0 times</span>
                  <span>•</span>
                  <span className="text-primary">{answers.length} answers</span>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {question.tags.map((tag, idx) => (
                    <Link key={idx} href={`/tags/${tag}`}>
                      <Badge variant="default" className="cursor-pointer hover:scale-105 transition-transform">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedCardReveal>

            <AnimatedCardReveal delay={200} direction="left">
              <div className="rounded-xl border border-white/10 bg-linear-to-br from-gray-900/50 to-black/50 backdrop-blur-sm p-6 mb-8">
                <div className="flex gap-6">
                  {/* Vote Buttons */}
                  <div className="shrink-0">
                    <VoteButtons
                      id={questionId}
                      type="question"
                      initialVoteCount={voteCount}
                    />
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Title</label>
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Question title"
                            className="w-full"
                          />
                        </div>
                        <div data-color-mode="dark">
                          <label className="block text-sm font-medium mb-2">Content</label>
                          <RTE
                            value={editContent}
                            onChange={(val) => setEditContent(val || '')}
                            height={300}
                            preview="edit"
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '0.5rem',
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                          <Input
                            value={editTags}
                            onChange={(e) => setEditTags(e.target.value)}
                            placeholder="react, typescript, nextjs"
                            className="w-full"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={handleUpdate}
                            disabled={isUpdating || !editTitle.trim() || !editContent.trim()}
                          >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button
                            onClick={() => setIsEditing(false)}
                            variant="outline"
                            disabled={isUpdating}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div data-color-mode="dark" className="prose prose-invert max-w-none mb-6">
                          <Markdown source={question.content} />
                        </div>

                        {/* Attachment Image */}
                        {question.attachmentId && (
                          <div className="mb-6 rounded-lg overflow-hidden border border-white/10">
                            <Image
                              src={getAttachmentUrl(question.attachmentId)}
                              alt="Question attachment"
                              width={800}
                              height={600}
                              className="w-full h-auto"
                              unoptimized
                            />
                          </div>
                        )}

                        {/* Question Footer */}
                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => setShowComments(!showComments)}
                              className="text-sm text-gray-400 hover:text-primary transition-colors"
                            >
                              {showComments ? 'Hide' : 'Show'} comments
                            </button>
                            
                            {isAuthor && (
                              <>
                                <span className="text-gray-600">•</span>
                                <Button
                                  onClick={handleEdit}
                                  variant="ghost"
                                  className="gap-2 text-sm h-auto py-1"
                                >
                                  <FiEdit2 size={14} />
                                  Edit
                                </Button>
                                <Button
                                  onClick={handleDelete}
                                  variant="ghost"
                                  className="gap-2 text-sm h-auto py-1 text-red-400 hover:text-red-300"
                                  disabled={isDeleting}
                                >
                                  <FiTrash2 size={14} />
                                  {isDeleting ? 'Deleting...' : 'Delete'}
                                </Button>
                              </>
                            )}
                          </div>

                          {/* Author Info */}
                          <div className="flex items-center gap-3">
                            {!authorLoading && author && (
                              <>
                                <Avatar
                                  src={author.avatar}
                                  alt={author.name}
                                  fallback={author.name.charAt(0)}
                                  size="md"
                                />
                                <div className="flex flex-col">
                                  <Link
                                    href={`/users/${question.authorId}`}
                                    className="text-primary hover:text-primary/80 font-medium"
                                  >
                                    {author.name}
                                  </Link>
                                  <span className="text-xs text-gray-500">
                                    {author.reputation} reputation
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Comments Section */}
                        {showComments && (
                          <div className="mt-6 pt-6 border-t border-white/10">
                            <Comments questionId={questionId} type="question" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedCardReveal>

            {/* Answers Section */}
            <AnimatedCardReveal delay={400} direction="bottom">
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                </h2>
                <Answers questionId={questionId} />
              </div>
            </AnimatedCardReveal>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
