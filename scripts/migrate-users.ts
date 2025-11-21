/**
 * Migration script to populate the users collection with existing user data
 * Run this after creating the users collection to migrate existing authors
 */

import { databases } from '../src/models/server/config'
import { db, questionCollection, answerCollection, usersCollection } from '../src/models/name'
import { Query } from 'node-appwrite'

interface Question {
  $id: string
  authorId: string
}

interface Answer {
  $id: string
  authorId: string
}

async function migrateUsers() {
  console.log('🔄 Starting user migration...\n')

  try {
    // Get all unique author IDs from questions and answers
    const authorIds = new Set<string>()

    console.log('📖 Fetching questions...')
    let questionsOffset = 0
    const questionsLimit = 100
    let hasMoreQuestions = true

    while (hasMoreQuestions) {
      const questionsResponse = await databases.listDocuments(
        db,
        questionCollection,
        [Query.limit(questionsLimit), Query.offset(questionsOffset)]
      )

      questionsResponse.documents.forEach((doc) => {
        const question = doc as unknown as Question
        if (question.authorId) {
          authorIds.add(question.authorId)
        }
      })

      questionsOffset += questionsLimit
      hasMoreQuestions = questionsResponse.documents.length === questionsLimit
      console.log(`  Found ${authorIds.size} unique authors so far...`)
    }

    console.log('\n📝 Fetching answers...')
    let answersOffset = 0
    const answersLimit = 100
    let hasMoreAnswers = true

    while (hasMoreAnswers) {
      const answersResponse = await databases.listDocuments(
        db,
        answerCollection,
        [Query.limit(answersLimit), Query.offset(answersOffset)]
      )

      answersResponse.documents.forEach((doc) => {
        const answer = doc as unknown as Answer
        if (answer.authorId) {
          authorIds.add(answer.authorId)
        }
      })

      answersOffset += answersLimit
      hasMoreAnswers = answersResponse.documents.length === answersLimit
    }

    console.log(`\n✅ Found ${authorIds.size} total unique authors\n`)

    // Create placeholder profiles for each author
    let created = 0
    let skipped = 0
    let failed = 0

    for (const authorId of authorIds) {
      try {
        // Check if profile already exists
        const existing = await databases.listDocuments(
          db,
          usersCollection,
          [Query.equal('userId', authorId), Query.limit(1)]
        )

        if (existing.documents.length > 0) {
          console.log(`⏭️  Skipping ${authorId.substring(0, 8)}... (already exists)`)
          skipped++
          continue
        }

        // Create placeholder profile
        await databases.createDocument(
          db,
          usersCollection,
          'unique()',
          {
            userId: authorId,
            name: 'User#' + authorId.substring(0, 6),
            email: `user-${authorId}@placeholder.local`,
            avatar: '',
            reputation: 0,
            bio: '',
          }
        )

        console.log(`✅ Created profile for ${authorId.substring(0, 8)}...`)
        created++
      } catch (error) {
        console.error(`❌ Failed to create profile for ${authorId.substring(0, 8)}...`, error)
        failed++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 Migration Summary:')
    console.log(`   Total authors: ${authorIds.size}`)
    console.log(`   ✅ Created: ${created}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    console.log(`   ❌ Failed: ${failed}`)
    console.log('='.repeat(50))
    console.log('\n✨ Migration complete!\n')
    console.log('ℹ️  Note: Placeholder profiles were created with default names.')
    console.log('   Users will update their profiles when they log in.')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
if (require.main === module) {
  migrateUsers()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error during migration:', err)
      process.exit(1)
    })
}

export default migrateUsers
