# Avatar Fix - User Profiles Implementation

## Problem
User avatars were not showing up on question pages because:
1. The app was only able to fetch the currently logged-in user's profile via Appwrite's `account` API
2. Other users' avatars couldn't be fetched since `account.get()` only works for the authenticated user
3. There was no database collection to store public user profile data

## Solution
Created a **users collection** to store public user profile information that can be queried by user ID.

---

## Changes Made

### 1. **Created Users Collection** (`src/models/server/user.collection.ts`)
- Stores user profile data including: userId, name, email, avatar, reputation, bio
- Indexed on `userId` for fast lookups
- Permissions set to allow reading by anyone, but only users can create/update their own profiles

### 2. **Updated Database Setup** (`src/models/server/dbSetup.ts`)
- Added `createUserTable()` to initialize the users collection

### 3. **Added User Profile Functions** (`src/lib/appwrite.ts`)
- `getUserProfile(userId)` - Fetch user profile by ID
- `createUserProfile(data)` - Create new user profile
- `updateUserProfile(userId, data)` - Update existing profile

### 4. **Updated useAuthor Hook** (`src/hooks/useAppwrite.ts`)
- Now fetches user data from the users collection instead of the account API
- Falls back to placeholder name if profile doesn't exist

### 5. **Updated Authentication Flow** (`src/store/Auth.ts`)
- Creates user profile in database when users register
- Syncs profile data when users log in

### 6. **Fixed Avatar Component** (`src/components/ui/avatar.tsx`)
- Set `unoptimized={true}` by default to support Appwrite storage URLs
- Added better error handling for missing images

### 7. **Updated Next.js Config** (`next.config.ts`)
- Added remote image patterns to allow Appwrite storage URLs

### 8. **Created Migration Script** (`scripts/migrate-users.ts`)
- Migrates existing author IDs from questions/answers to users collection

---

## Setup Instructions

### Step 1: Create the Users Collection
Run the database setup script to create the users collection:

```bash
npm run setup-db
```

This will create the users collection with all necessary attributes and indexes.

### Step 2: Migrate Existing Users (Optional)
If you have existing questions/answers with author IDs, run the migration script:

```bash
npm run migrate-users
```

This will:
- Scan all questions and answers for unique author IDs
- Create placeholder user profiles for each author
- Skip profiles that already exist

**Note:** Placeholder profiles will have names like "User#abc123". When users log in, their actual name and avatar will be synced.

### Step 3: Restart Development Server
```bash
npm run dev
```

---

## How It Works Now

1. **User Registration:**
   - User creates account → Appwrite auth entry created
   - Profile automatically created in users collection with name, email, reputation

2. **User Login:**
   - User logs in → Appwrite session created
   - System checks if profile exists in users collection
   - If not, creates profile automatically

3. **Displaying Avatars:**
   - `useAuthor(authorId)` hook fetches from users collection
   - Avatar URL is retrieved and displayed
   - Falls back to initials if no avatar or profile not found

4. **Updating Profiles:**
   - Users can update their avatar by storing the URL in their profile
   - Use `updateUserProfile(userId, { avatar: 'url' })` function

---

## Adding Avatars

To allow users to upload avatars, you need to:

1. **Create a Storage Bucket** in Appwrite for avatars
2. **Add Upload Functionality** in a profile settings page
3. **Update Profile** with the avatar URL after upload

Example:
```typescript
// Upload avatar
const file = await storage.createFile(
  'avatars-bucket-id',
  'unique()',
  avatarFile
)

// Get file URL
const avatarUrl = storage.getFileView('avatars-bucket-id', file.$id)

// Update user profile
await updateUserProfile(userId, { avatar: avatarUrl.toString() })
```

---

## Testing

1. **Register a new user** - Should automatically create profile
2. **Login with existing user** - Should sync profile if missing
3. **View questions page** - Should show user names (or placeholders)
4. **View question detail** - Should show author info

---

## Troubleshooting

### Avatars still not showing?
1. Check browser console for image loading errors
2. Verify the avatar URL is valid in the users collection
3. Make sure Next.js config allows the image domain
4. Try setting `unoptimized={true}` on Avatar component

### Users collection not created?
1. Run `npm run setup-db` again
2. Check Appwrite console for collection
3. Verify environment variables are set correctly

### Migration errors?
1. Check that questions/answers collections exist
2. Verify database permissions
3. Run with verbose logging to see specific errors

---

## Future Enhancements

- [ ] Add avatar upload functionality
- [ ] Add profile editing page
- [ ] Sync reputation from user prefs to users collection
- [ ] Add user profile page with stats
- [ ] Cache user profiles for better performance
- [ ] Add default avatar generation (like Gravatar)

---

## Files Modified

- `src/models/name.ts` - Added usersCollection constant
- `src/models/server/user.collection.ts` - NEW
- `src/models/server/dbSetup.ts` - Import and create users table
- `src/lib/appwrite.ts` - Added user profile functions
- `src/hooks/useAppwrite.ts` - Updated useAuthor hook
- `src/store/Auth.ts` - Create/sync profiles on login/register
- `src/components/ui/avatar.tsx` - Set unoptimized default
- `next.config.ts` - Allow remote image domains
- `scripts/migrate-users.ts` - NEW
- `package.json` - Added migrate-users script
