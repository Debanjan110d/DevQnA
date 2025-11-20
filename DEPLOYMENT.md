# Deploying DevQnA to Vercel

## Prerequisites
- Vercel account ([vercel.com](https://vercel.com))
- Appwrite instance (cloud or self-hosted)
- GitHub account (for connecting repository)

## Deployment Steps

### 1. Push to GitHub
Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `Debanjan110d/stcakoverflow_using_appwirte`

### 3. Configure Environment Variables
In Vercel project settings, add these environment variables:

**Public Variables:**
- `NEXT_PUBLIC_APPWRITE_HOST_URI` - Your Appwrite endpoint (e.g., `https://cloud.appwrite.io/v1`)
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Your Appwrite project ID
- `NEXT_PUBLIC_APPWRITE_PROJECT_NAME` - Project name (e.g., "DevQnA")
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID` - Database ID (e.g., "main-stackoverflow")
- `NEXT_PUBLIC_APPWRITE_QUESTION_COLLECTION_ID` - Question collection ID
- `NEXT_PUBLIC_APPWRITE_ANSWER_COLLECTION_ID` - Answer collection ID
- `NEXT_PUBLIC_APPWRITE_VOTE_COLLECTION_ID` - Vote collection ID
- `NEXT_PUBLIC_APPWRITE_COMMENT_COLLECTION_ID` - Comment collection ID

**Secret Variables:**
- `APPWRITE_API_KEY` - Your Appwrite API key (server-side only)

### 4. Deploy
Click "Deploy" and Vercel will:
- Install dependencies
- Build your Next.js app
- Deploy to production

### 5. Update Appwrite Settings
Once deployed, update your Appwrite project:
1. Go to your Appwrite console
2. Navigate to your project settings
3. Add your Vercel domain to **Platforms** → **Web**:
   - Add `https://your-app.vercel.app`
   - Add `https://*.vercel.app` for preview deployments

### 6. Custom Domain (Optional)
1. In Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Add custom domain to Appwrite platforms

## Automatic Deployments
- **Production**: Pushes to `main` branch auto-deploy to production
- **Preview**: Pull requests create preview deployments

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Review build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`

### Runtime Errors
- Verify Appwrite endpoint is accessible
- Check API key has proper permissions
- Ensure Vercel domain is added to Appwrite platforms

### CORS Issues
- Add Vercel domains to Appwrite platforms
- Include both production and preview URLs (`*.vercel.app`)

## Local Testing
Test production build locally:
```bash
npm run build
npm start
```

## Support
For issues, check:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
