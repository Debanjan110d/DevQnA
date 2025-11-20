# Deploying DevQnA to Vercel

## Prerequisites
- Vercel account ([vercel.com](https://vercel.com))
- Appwrite instance (cloud or self-hosted)
- GitHub account (for connecting repository)
- All changes committed to Git

## Quick Deployment Steps

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Sign in with GitHub
3. Click "Import Git Repository"
4. Select your repository: `Debanjan110d/stcakoverflow_using_appwirte`
5. Vercel will auto-detect it's a Next.js project - **just click "Deploy"**

### 3. Add Environment Variables After First Deploy
After the initial deployment (which may fail due to missing env vars):

1. Go to your project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables (copy from your `.env` file):

```plaintext
NEXT_PUBLIC_APPWRITE_HOST_URI=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=DevQnA
NEXT_PUBLIC_APPWRITE_DATABASE_ID=main-stackoverflow
NEXT_PUBLIC_APPWRITE_QUESTION_COLLECTION_ID=your_collection_id
NEXT_PUBLIC_APPWRITE_ANSWER_COLLECTION_ID=your_collection_id
NEXT_PUBLIC_APPWRITE_VOTE_COLLECTION_ID=your_collection_id
NEXT_PUBLIC_APPWRITE_COMMENT_COLLECTION_ID=your_collection_id
APPWRITE_API_KEY=your_api_key_here
```

4. Make sure to select **Production**, **Preview**, and **Development** for each variable
5. Click **Save**
6. Go to **Deployments** and click "Redeploy" on the latest deployment

### 4. Configure Appwrite for Your Vercel Domain
1. Open your Appwrite Console
2. Go to your project
3. Navigate to **Settings** → **Platforms**
4. Click **Add Platform** → **Web App**
5. Add these hostnames:
   - `https://your-app-name.vercel.app` (your production URL)
   - `https://*.vercel.app` (for preview deployments)
6. Save changes

### 5. Test Your Deployment
Visit your Vercel URL and verify:
- ✅ Pages load correctly
- ✅ Login/Register works
- ✅ Questions can be created
- ✅ No CORS errors in browser console

## Important Notes

### Build Command
Vercel automatically detects Next.js and uses:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

The `next.config.ts` is configured with `output: 'standalone'` for optimized Vercel deployments.

**Do NOT create a `vercel.json` file** - it can cause conflicts with auto-detection.

### Environment Variables
- All `NEXT_PUBLIC_*` variables are exposed to the browser
- `APPWRITE_API_KEY` is server-side only and should be marked as **Sensitive**
- Set variables for all environments (Production, Preview, Development)

### Automatic Deployments
- **Production**: Every push to `main` branch auto-deploys
- **Preview**: Pull requests create preview URLs
- **Development**: Not used for Next.js apps

## Custom Domain (Optional)
1. In Vercel project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Add the custom domain to Appwrite platforms

## Troubleshooting

### Build Errors
**Error**: `Module not found` or `Cannot find module`
- **Solution**: Ensure all imports use correct paths and all dependencies are in `package.json`

**Error**: Type errors during build
- **Solution**: Run `npm run build` locally first to catch TypeScript errors

### Runtime Errors
**Error**: `Failed to fetch` or network errors
- **Solution**: Check environment variables are set correctly in Vercel

**Error**: CORS errors in browser console
- **Solution**: Add Vercel domain to Appwrite platforms (including `*.vercel.app`)

**Error**: `401 Unauthorized` from Appwrite
- **Solution**: Verify `APPWRITE_API_KEY` is correct and has proper permissions

### Function Timeout
If you get timeout errors:
1. Go to Vercel project → **Settings** → **Functions**
2. Increase timeout limit (Pro plan required for >10s)

## Local Production Testing
Test production build locally before deploying:
```bash
npm run build
npm start
```

Visit `http://localhost:3000` and verify everything works.

## Support Resources
- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Appwrite Platforms Setup](https://appwrite.io/docs/getting-started-for-web)

## Common Commands
```bash
# Redeploy from CLI (install vercel CLI first: npm i -g vercel)
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```
