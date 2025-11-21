"use client"

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { ShimmerButton } from './ui/shimmer-button'
import { uploadQuestionAttachment } from '@/lib/appwrite'
import dynamic from 'next/dynamic'

const RTE = dynamic(() => import('./RTE'), { ssr: false })

interface QuestionFormProps {
  onSubmit?: (data: QuestionData) => void | Promise<void>
  authorId: string
}

export interface QuestionData {
  title: string
  content: string
  tags: string[]
  authorId: string
  attachmentId?: string
}

export function QuestionForm({ onSubmit, authorId }: QuestionFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || title.length < 15) {
      setError('Title must be at least 15 characters')
      return
    }

    if (!content.trim() || content.length < 20) {
      setError('Details must be at least 20 characters')
      return
    }

    if (!tags.trim()) {
      setError('Please add at least one tag')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean)
      
      // Upload image if present
      let attachmentId: string | undefined
      if (image) {
        const uploadResult = await uploadQuestionAttachment(image)
        if (uploadResult.success && uploadResult.fileId) {
          attachmentId = uploadResult.fileId
        } else {
          throw new Error('Failed to upload image')
        }
      }
      
      const questionData: QuestionData = {
        title: title.trim(),
        content: content.trim(),
        tags: tagArray,
        authorId,
        attachmentId,
      }

      if (onSubmit) {
        await onSubmit(questionData)
      }

      // Reset form
      setTitle('')
      setContent('')
      setTags('')
      setImage(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit question')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-xl border border-white/10 bg-linear-to-br from-gray-900/50 to-black/50 backdrop-blur-xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg font-semibold text-white">
              Title Address
            </Label>
            <p className="text-sm text-gray-400">
              Be specific and imagine you&apos;re asking a question to another person.
            </p>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 text-base focus:border-primary/50 focus:ring-primary/20"
              maxLength={200}
            />
          </div>

          {/* Content/Details */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-lg font-semibold text-white">
              What are the details of your problem?
            </Label>
            <p className="text-sm text-gray-400">
              Introduce the problem and expand on what you put in the title. Minimum 20 characters.
            </p>
            <div data-color-mode="dark" className="min-h-[300px]">
              <RTE
                value={content}
                onChange={(val) => setContent(val || '')}
                height={300}
                preview="edit"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                }}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-lg font-semibold text-white">
              Image
            </Label>
            <p className="text-sm text-gray-400">
              Add an image to your question to make it more clear and easier to understand.
            </p>
            <div className="relative">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
              />
            </div>
            {image && (
              <p className="text-sm text-primary mt-2">
                Selected: {image.name}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-lg font-semibold text-white">
              Tags
            </Label>
            <p className="text-sm text-gray-400">
              Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
            </p>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. javascript, react, typescript (comma-separated)"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 text-base focus:border-primary/50 focus:ring-primary/20"
            />
            {tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.split(',').map((tag, idx) => (
                  tag.trim() && (
                    <Badge key={idx} variant="default">
                      {tag.trim()}
                    </Badge>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <ShimmerButton
              type="submit"
              disabled={isSubmitting}
              shimmerDuration="3s"
              className="px-8 py-3"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Posting...
                </span>
              ) : (
                '✨ Add Question'
              )}
            </ShimmerButton>
          </div>
        </form>
      </div>
    </div>
  )
}
