// Client-side Appwrite utilities
import { databases, storage } from '@/models/client/config'
import { db, questionCollection, answerCollection, votesCollection, commentCollection, usersCollection, questionAttachmentBucket } from '@/models/name'
import { Query, ID } from 'appwrite'

export interface Question {
  $id: string
  $createdAt: string
  $updatedAt: string
  title: string
  content: string
  authorId: string
  tags: string[]
  attachmentId?: string
}

export interface Answer {
  $id: string
  $createdAt: string
  $updatedAt: string
  content: string
  authorId: string
  questionId: string
}

export interface Vote {
  $id: string
  $createdAt: string
  voteStatus: 'upvoted' | 'downvoted'
  votedById: string
  typeId: string
  type: 'question' | 'answer'
}

export interface Comment {
  $id: string
  $createdAt: string
  content: string
  authorId: string
  typeId: string
  type: 'question' | 'answer'
}

export interface UserProfile {
  $id: string
  $createdAt: string
  userId: string
  name: string
  email: string
  avatar?: string
  reputation: number
  bio?: string
}

// Users
export async function getUserProfile(userId: string) {
  try {
    const response = await databases.listDocuments(
      db,
      usersCollection,
      [Query.equal('userId', userId), Query.limit(1)]
    )
    return response.documents[0] as unknown as UserProfile | undefined
  } catch {
    return undefined
  }
}

export async function createUserProfile(data: {
  userId: string
  name: string
  email: string
  avatar?: string
  reputation?: number
  bio?: string
}) {
  try {
    const response = await databases.createDocument(
      db,
      usersCollection,
      'unique()',
      {
        userId: data.userId,
        name: data.name,
        email: data.email,
        avatar: data.avatar || '',
        reputation: data.reputation || 0,
        bio: data.bio || '',
      }
    )
    return { success: true, data: response as unknown as UserProfile }
  } catch (error) {
    console.error('Failed to create user profile:', error)
    return { success: false, error }
  }
}

export async function updateUserProfile(userId: string, data: {
  name?: string
  avatar?: string
  reputation?: number
  bio?: string
}) {
  try {
    // First find the document by userId
    const existing = await getUserProfile(userId)
    if (!existing) {
      return { success: false, error: 'User profile not found' }
    }

    const response = await databases.updateDocument(
      db,
      usersCollection,
      existing.$id,
      data
    )
    return { success: true, data: response as unknown as UserProfile }
  } catch (error) {
    console.error('Failed to update user profile:', error)
    return { success: false, error }
  }
}

// Questions
export async function getQuestions(limit = 25, offset = 0) {
  try {
    const response = await databases.listDocuments(
      db,
      questionCollection,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(offset)
      ]
    )
    return {
      success: true,
      documents: response.documents as unknown as Question[],
      total: response.total
    }
  } catch {
    return { documents: [], total: 0 }
  }
}

export async function getQuestionById(questionId: string) {
  try {
    const question = await databases.getDocument(
      db,
      questionCollection,
      questionId
    )
    return question as unknown as Question
  } catch {
    return null
  }
}

export async function uploadQuestionAttachment(file: File) {
  try {
    const response = await storage.createFile(
      questionAttachmentBucket,
      ID.unique(),
      file
    )
    return { success: true, fileId: response.$id }
  } catch (error) {
    console.error('Failed to upload attachment:', error)
    return { success: false, error }
  }
}

export function getAttachmentUrl(fileId: string) {
  return storage.getFileView(questionAttachmentBucket, fileId).toString()
}

export async function createQuestion(data: {
  title: string
  content: string
  authorId: string
  tags: string[]
  attachmentId?: string
}) {
  try {
    const response = await databases.createDocument(
      db,
      questionCollection,
      'unique()',
      data
    )
    return { success: true, data: response as unknown as Question }
  } catch {
    return { success: false }
  }
}

export async function updateQuestion(questionId: string, data: {
  title?: string
  content?: string
  tags?: string[]
}) {
  try {
    const response = await databases.updateDocument(
      db,
      questionCollection,
      questionId,
      data
    )
    return { success: true, data: response as unknown as Question }
  } catch (error) {
    return { success: false, error }
  }
}

export async function deleteQuestion(questionId: string) {
  try {
    // First, delete all answers related to this question
    const answers = await getAnswersByQuestionId(questionId)
    
    // Delete each answer
    await Promise.all(
      answers.map(answer => databases.deleteDocument(db, answerCollection, answer.$id))
    )
    
    // Delete all votes related to this question
    const votes = await getVotesByTypeId(questionId, 'question')
    await Promise.all(
      votes.map(vote => databases.deleteDocument(db, votesCollection, vote.$id))
    )
    
    // Delete all comments related to this question
    const comments = await getCommentsByTypeId(questionId, 'question')
    await Promise.all(
      comments.map(comment => databases.deleteDocument(db, commentCollection, comment.$id))
    )
    
    // Finally, delete the question itself
    await databases.deleteDocument(db, questionCollection, questionId)
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

// Answers
export async function getAnswersByQuestionId(questionId: string) {
  try {
    const response = await databases.listDocuments(
      db,
      answerCollection,
      [
        Query.equal('questionId', questionId),
        Query.orderDesc('$createdAt')
      ]
    )
    return response.documents as unknown as Answer[]
  } catch {
    return []
  }
}

export async function createAnswer(data: {
  content: string
  authorId: string
  questionId: string
}) {
  try {
    const response = await databases.createDocument(
      db,
      answerCollection,
      'unique()',
      data
    )
    return { success: true, data: response as unknown as Answer }
  } catch (error) {
    return { success: false, error }
  }
}

export async function updateAnswer(answerId: string, data: {
  content: string
}) {
  try {
    const response = await databases.updateDocument(
      db,
      answerCollection,
      answerId,
      data
    )
    return { success: true, data: response as unknown as Answer }
  } catch (error) {
    return { success: false, error }
  }
}

export async function deleteAnswer(answerId: string) {
  try {
    await databases.deleteDocument(db, answerCollection, answerId)
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

// Votes
export async function getVotesByTypeId(typeId: string, type: 'question' | 'answer') {
  try {
    const response = await databases.listDocuments(
      db,
      votesCollection,
      [
        Query.equal('typeId', typeId),
        Query.equal('type', type)
      ]
    )
    return response.documents as unknown as Vote[]
  } catch {
    return []
  }
}

export async function getUserVote(typeId: string, type: 'question' | 'answer', userId: string) {
  try {
    const response = await databases.listDocuments(
      db,
      votesCollection,
      [
        Query.equal('typeId', typeId),
        Query.equal('type', type),
        Query.equal('votedById', userId)
      ]
    )
    return response.documents[0] as unknown as Vote | undefined
  } catch {
    return undefined
  }
}

export async function createOrUpdateVote(data: {
  voteStatus: 'upvoted' | 'downvoted'
  votedById: string
  typeId: string
  type: 'question' | 'answer'
}, existingVoteId?: string) {
  try {
    if (existingVoteId) {
      // Update existing vote
      const response = await databases.updateDocument(
        db,
        votesCollection,
        existingVoteId,
        { voteStatus: data.voteStatus }
      )
      return { success: true, data: response as unknown as Vote }
    } else {
      // Create new vote
      const response = await databases.createDocument(
        db,
        votesCollection,
        'unique()',
        data
      )
      return { success: true, data: response as unknown as Vote }
    }
  } catch (error) {
    return { success: false, error }
  }
}

export async function deleteVote(voteId: string) {
  try {
    await databases.deleteDocument(db, votesCollection, voteId)
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

// Comments
export async function getCommentsByTypeId(typeId: string, type: 'question' | 'answer') {
  try {
    const response = await databases.listDocuments(
      db,
      commentCollection,
      [
        Query.equal('typeId', typeId),
        Query.equal('type', type),
        Query.orderDesc('$createdAt')
      ]
    )
    return response.documents as unknown as Comment[]
  } catch {
    return []
  }
}

export async function createComment(data: {
  content: string
  authorId: string
  typeId: string
  type: 'question' | 'answer'
}) {
  try {
    const response = await databases.createDocument(
      db,
      commentCollection,
      'unique()',
      data
    )
    return { success: true, data: response as unknown as Comment }
  } catch (error) {
    return { success: false, error }
  }
}

// Helper functions
export function calculateVoteCount(votes: Vote[]) {
  return votes.reduce((count, vote) => {
    return vote.voteStatus === 'upvoted' ? count + 1 : count - 1
  }, 0)
}

// Get statistics
export async function getStats() {
  try {
    // Get total questions count
    const questionsResult = await databases.listDocuments(
      db,
      questionCollection,
      [Query.limit(1)] // Just need the count
    )
    
    // Get total answers count
    const answersResult = await databases.listDocuments(
      db,
      answerCollection,
      [Query.limit(1)]
    )
    
    // Get total users count (approximation - actual count would need account API)
    // For now, get unique author IDs from questions
    const allQuestions = await databases.listDocuments(
      db,
      questionCollection,
      [Query.limit(1000)] // Reasonable limit
    )
    
    const uniqueAuthors = new Set(allQuestions.documents.map(q => (q as unknown as Question).authorId))
    
    return {
      success: true,
      data: {
        questions: questionsResult.total,
        answers: answersResult.total,
        users: uniqueAuthors.size,
      }
    }
  } catch (error) {
    return {
      success: false,
      error,
      data: {
        questions: 0,
        answers: 0,
        users: 0,
      }
    }
  }
}
