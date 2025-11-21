# DevQnA - Developer Q&A Community 🚀

> A modern, full-stack Stack Overflow clone with stunning animations and powerful features

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://devqna-volx.vercel.app/)
[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Appwrite](https://img.shields.io/badge/Appwrite-BaaS-f02e65?style=for-the-badge&logo=appwrite)](https://appwrite.io/)

**🌐 Live Demo:** [https://devqna-volx.vercel.app/](https://devqna-volx.vercel.app/)

Built by **Debanjan** | Version 2.0

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🌟 Overview

DevQnA is a modern Q&A platform designed for developers to share knowledge, solve problems, and build community. Inspired by Stack Overflow, it features a clean, responsive UI with smooth animations and a robust backend powered by Appwrite.

### Key Highlights

✅ **Full-featured Q&A platform** with questions, answers, comments, and voting  
✅ **User authentication** with secure login/registration  
✅ **Rich text editor** with markdown support and code highlighting  
✅ **Image uploads** for questions with Appwrite Storage  
✅ **User profiles** with reputation system and avatar support  
✅ **Tag-based organization** for easy content discovery  
✅ **Real-time updates** for votes and interactions  
✅ **Responsive design** optimized for all devices  
✅ **Beautiful animations** using Anime.js and Framer Motion  

---

## 🚀 Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.1 | React framework with App Router |
| **React** | 19.2.0 | UI library with RSC support |
| **TypeScript** | ^5 | Type-safe development |
| **Tailwind CSS** | ^4 | Utility-first styling |
| **Anime.js** | ^4.2.2 | Advanced animations |
| **Framer Motion** | ^12.23.24 | Animation library |

### Backend & Services

| Service | Purpose |
|---------|---------|
| **Appwrite** | Backend-as-a-Service |
| ├─ Authentication | User management & sessions |
| ├─ Database (Tables) | NoSQL document storage |
| ├─ Storage | File uploads & management |
| └─ Functions | Serverless functions |

### UI Components & Libraries

- **@uiw/react-md-editor** - Markdown editor with preview
- **Shadcn/ui** - Radix UI component library
- **Lucide React** - Beautiful icon library
- **React Icons** - Additional icon sets
- **Zustand** - Lightweight state management
- **Class Variance Authority** - Component variants

## ✨ Features

### Core Functionality

#### 🔐 Authentication & User Management
- Secure user registration and login
- Session management with JWT tokens
- User profiles with customizable avatars
- Reputation system tracking contributions
- Password recovery (planned)

#### ❓ Questions & Answers
- **Create Questions** - Rich markdown editor with code syntax highlighting
- **Upload Images** - Attach screenshots and diagrams to questions
- **Add Answers** - Provide detailed solutions to help others
- **Edit & Delete** - Full CRUD operations for your content
- **Markdown Support** - Format content with headers, lists, code blocks, and more

#### 💬 Engagement Features
- **Voting System** - Upvote/downvote questions and answers
- **Comments** - Threaded discussions on questions and answers
- **Reputation Points** - Earn reputation for helpful contributions
- **Tags** - Organize and filter content by technology/topic
- **View Counts** - Track question popularity

#### 🎨 UI/UX Excellence
- **Responsive Design** - Mobile-first, works on all devices
- **Dark Theme** - Easy on the eyes for long coding sessions
- **Smooth Animations** - Polished interactions throughout
- **Loading States** - Elegant spinners and skeleton screens
- **Error Handling** - Clear feedback for user actions

### Animated Components
- **AnimatedLoader** - 5 variants (dots, wave, pulse, orbit, infinity)
- **AnimatedCounter** - Smooth number transitions
- **AnimatedProgress** - Linear, circular, and gradient progress bars
- **AnimatedList** - Staggered list animations
- **AnimatedCardReveal** - Scroll-triggered card animations
- **FloatingElements** - Background particle effects
- **GlitchText** - Hover glitch effect
- **TypingAnimation** - Typewriter text effect
- **AuroraText** - Gradient aurora effect
- **Particles** - Interactive particle system
- **ShimmerButton** - Shimmering button effect
- **BorderBeam** - Animated border glow

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Appwrite** account ([cloud.appwrite.io](https://cloud.appwrite.io) or self-hosted)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Debanjan110d/stcakoverflow_using_appwirte.git
   cd stcakoverflow_using_appwirte
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_HOST_URI=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
   APPWRITE_API_KEY=your_api_key_here
   ```

   **How to get credentials:**
   - Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
   - Create a new project
   - Copy the Project ID from project settings
   - Generate an API key with full permissions

4. **Set up Appwrite database and storage**
   ```bash
   npm run setup-db
   ```
   
   This will create:
   - ✅ Users collection (profiles with avatars)
   - ✅ Questions collection
   - ✅ Answers collection
   - ✅ Comments collection
   - ✅ Votes collection
   - ✅ Storage bucket for question attachments

5. **Optional: Migrate existing users**
   ```bash
   npm run migrate-users
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start Video

For a visual guide, check out the setup tutorial: [Coming Soon]

---

## 📁 Project Structure

```
devqna/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Registration page
│   │   │   └── layout.tsx       # Auth layout
│   │   ├── api/                 # API routes
│   │   │   ├── answer/          # Answer endpoints
│   │   │   └── vote/            # Vote endpoints
│   │   ├── ask/                 # Ask question page
│   │   ├── questions/           # Questions pages
│   │   │   ├── [id]/           # Question detail
│   │   │   └── page.tsx        # Questions list
│   │   ├── tags/               # Browse by tags
│   │   ├── users/              # User profiles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   │
│   ├── components/              # React components
│   │   ├── ui/                 # UI library (Shadcn)
│   │   │   ├── avatar.tsx      # Avatar with fallback
│   │   │   ├── button.tsx      # Button variants
│   │   │   ├── card.tsx        # Card component
│   │   │   ├── spinner.tsx     # Loading spinner
│   │   │   └── ...             # Other UI components
│   │   ├── Answers.tsx         # Answer list & form
│   │   ├── Comments.tsx        # Comment threads
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Pagination.tsx      # Page navigation
│   │   ├── QuestionCard.tsx    # Question preview
│   │   ├── QuestionForm.tsx    # Ask question form
│   │   ├── RTE.tsx             # Rich text editor
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   └── VoteButtons.tsx     # Voting UI
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── useAppwrite.ts      # Appwrite data hooks
│   │
│   ├── lib/                     # Utility functions
│   │   ├── appwrite.ts         # Appwrite client SDK
│   │   └── utils.ts            # Helper functions
│   │
│   ├── models/                  # Appwrite configuration
│   │   ├── client/             # Client-side SDK
│   │   │   └── config.ts       # Client initialization
│   │   ├── server/             # Server-side SDK
│   │   │   ├── config.ts       # Server initialization
│   │   │   ├── dbSetup.ts      # Database setup
│   │   │   ├── storageSetup.ts # Storage bucket setup
│   │   │   ├── user.collection.ts
│   │   │   ├── question.collection.ts
│   │   │   ├── answer.collection.ts
│   │   │   ├── comment.collection.ts
│   │   │   └── votes.collection.ts
│   │   ├── index.ts            # Type definitions
│   │   └── name.ts             # Collection names
│   │
│   ├── store/                   # State management
│   │   └── Auth.ts             # Zustand auth store
│   │
│   └── proxy.ts                # Server proxy setup
│
├── scripts/                     # Utility scripts
│   ├── setup-db.ts             # Database initialization
│   └── migrate-users.ts        # User migration script
│
├── public/                      # Static assets
├── .env.local                  # Environment variables (create this)
├── next.config.ts              # Next.js configuration
├── tailwind.config.cjs         # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── package.json                # Project dependencies
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APPWRITE_HOST_URI` | Appwrite API endpoint | `https://cloud.appwrite.io/v1` |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Your Appwrite project ID | `6734abc...` |
| `APPWRITE_API_KEY` | Server-side API key | `d123abc...` |

### Appwrite Collections

The app uses the following database collections:

#### Users Collection (`users`)
- `userId` (string) - Appwrite account ID
- `name` (string) - Display name
- `email` (string) - Email address
- `avatar` (string, optional) - Avatar URL
- `reputation` (integer) - User reputation score
- `bio` (string, optional) - User biography

#### Questions Collection (`questions`)
- `title` (string) - Question title
- `content` (string) - Markdown content
- `authorId` (string) - Author's user ID
- `tags` (array) - Topic tags
- `attachmentId` (string, optional) - Image file ID

#### Answers Collection (`answers`)
- `content` (string) - Markdown content
- `authorId` (string) - Author's user ID
- `questionId` (string) - Parent question ID

#### Comments Collection (`comments`)
- `content` (string) - Comment text
- `authorId` (string) - Author's user ID
- `typeId` (string) - Parent question/answer ID
- `type` (enum) - "question" or "answer"

#### Votes Collection (`votes`)
- `voteStatus` (enum) - "upvoted" or "downvoted"
- `votedById` (string) - Voter's user ID
- `typeId` (string) - Target question/answer ID
- `type` (enum) - "question" or "answer"

### Storage Buckets

- **question-attachments** - Stores uploaded images
  - Max size: 50MB
  - Allowed: jpg, png, jpeg, gif, webp, pdf

---

## 📚 API Documentation

### Client-Side Functions

```typescript
// Questions
getQuestions(limit, offset) → { documents, total }
getQuestionById(id) → Question
createQuestion(data) → { success, data }
updateQuestion(id, data) → { success, data }
deleteQuestion(id) → { success }

// Answers
getAnswersByQuestionId(id) → Answer[]
createAnswer(data) → { success, data }
updateAnswer(id, data) → { success, data }
deleteAnswer(id) → { success }

// Votes
getVotesByTypeId(id, type) → Vote[]
createOrUpdateVote(data, existingId?) → { success, data }
deleteVote(id) → { success }

// Comments
getCommentsByTypeId(id, type) → Comment[]
createComment(data) → { success, data }

// Users
getUserProfile(userId) → UserProfile
createUserProfile(data) → { success, data }
updateUserProfile(userId, data) → { success, data }

// Storage
uploadQuestionAttachment(file) → { success, fileId }
getAttachmentUrl(fileId) → string
```

### Custom Hooks

```typescript
// Data fetching hooks
useQuestions(limit, offset) → { questions, total, loading, error }
useQuestion(id) → { question, loading, error, refetch }
useAnswers(questionId) → { answers, loading, error, refetch }
useVotes(id, type) → { votes, voteCount, userVote, loading, refetch }
useComments(id, type) → { comments, loading, error, refetch }
useAuthor(authorId) → { author, loading }
useStats() → { stats, loading, refetch }
```

---

## 🚦 Available Scripts

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Production
npm run build            # Build for production
npm run start            # Start production server

# Database & Setup
npm run setup-db         # Initialize Appwrite database and storage
npm run migrate-users    # Migrate existing users to new schema

# Code Quality
npm run lint             # Run ESLint checks
```

---

## 🎨 UI Component Library

### Animated Components

Built with Anime.js and Framer Motion for smooth, eye-catching interactions:

- **AnimatedLoader** - 5 variants (dots, wave, pulse, orbit, infinity)
- **AnimatedCounter** - Smooth number transitions
- **AnimatedProgress** - Linear, circular, gradient progress bars
- **AnimatedList** - Staggered list animations
- **AnimatedCardReveal** - Scroll-triggered card reveals
- **FloatingElements** - Background particle effects
- **GlitchText** - Hover glitch effect
- **TypingAnimation** - Typewriter text effect
- **AuroraText** - Gradient aurora effect
- **Particles** - Interactive particle system
- **ShimmerButton** - Shimmering button effect
- **BorderBeam** - Animated border glow
- **MagicCard** - Gradient card hover effect

### UI Components (Shadcn-based)

Built on Radix UI primitives with Tailwind CSS:

- **Button** - Multiple variants and sizes
- **Input** - Text inputs with icons
- **Textarea** - Multi-line text input
- **Label** - Form labels
- **Card** - Content containers
- **Badge** - Tag-like badges
- **Avatar** - User avatars with fallback
- **Spinner** - Loading indicators

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. **Configure environment variables**
   - Add all variables from `.env.local`
   - Click "Deploy"

4. **Update Appwrite settings**
   - Add your Vercel domain to Appwrite's allowed domains
   - Update redirect URLs if using OAuth

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- **Netlify** - Add build command: `npm run build`
- **Railway** - Auto-detects Next.js configuration
- **AWS Amplify** - Full Next.js support
- **Digital Ocean App Platform** - One-click deploy

**Live Demo:** [https://devqna-volx.vercel.app/](https://devqna-volx.vercel.app/)

---

## 🌟 Key Features Implementation

### Markdown Editor
- Real-time preview
- Code syntax highlighting
- Toolbar with formatting options
- Dark mode support

### Voting System
- Upvote/downvote questions and answers
- Vote count updates in real-time
- Visual feedback with animations

### Reputation System
- Track user contributions
- Award points for helpful answers
- Display user stats on profile

### Search & Filter
- Full-text search across questions
- Filter by tags, date, votes
- Sort by newest, active, unanswered

## 🎯 Roadmap & Future Features

### Version 2.1 (In Progress)
- [ ] Real-time notifications
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Advanced search with filters
- [ ] Tag suggestions while typing

### Version 2.2 (Planned)
- [ ] Badges and achievements system
- [ ] User following system
- [ ] Bookmarks and favorites
- [ ] Code playground integration
- [ ] Dark/light theme toggle

### Version 3.0 (Future)
- [ ] Admin dashboard
- [ ] Content moderation tools
- [ ] Analytics and insights
- [ ] Mobile applications (React Native)
- [ ] API rate limiting
- [ ] Community guidelines enforcement
- [ ] Multi-language support (i18n)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please open an issue on GitHub with:

- **Bug Reports:** Steps to reproduce, expected vs actual behavior, screenshots
- **Feature Requests:** Clear description, use cases, potential implementation

---

## 📄 License

This project is licensed under the **MIT License** - feel free to use it for learning or commercial purposes.

```
MIT License

Copyright (c) 2025 Debanjan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👏 Acknowledgments & Credits

Built with inspiration and components from:

- **[Stack Overflow](https://stackoverflow.com/)** - The original Q&A platform
- **[Appwrite](https://appwrite.io/)** - Amazing BaaS platform
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Magic UI](https://magicui.design/)** - Animated components
- **[Aceternity UI](https://ui.aceternity.com/)** - UI inspiration
- **[Anime.js](https://animejs.com/)** - Animation library
- **[Vercel](https://vercel.com/)** - Hosting and deployment

### Special Thanks

- The Next.js team for an amazing framework
- The React community for continuous innovation
- All open-source contributors who made this possible

---

## 📧 Contact & Support

**Built by:** Debanjan  
**GitHub:** [@Debanjan110d](https://github.com/Debanjan110d)  
**Live Demo:** [https://devqna-volx.vercel.app/](https://devqna-volx.vercel.app/)

For questions, feedback, or support:
- 💬 Open an issue on GitHub
- 📧 Email: [Your Email]
- 🐦 Twitter: [Your Twitter]

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**DevQnA** - Where developers help developers 🚀

Made with ❤️ by Debanjan

[Live Demo](https://devqna-volx.vercel.app/) • [Report Bug](https://github.com/Debanjan110d/stcakoverflow_using_appwirte/issues) • [Request Feature](https://github.com/Debanjan110d/stcakoverflow_using_appwirte/issues)

</div>
