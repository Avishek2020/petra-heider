# Deployment Guide for Vercel

## Prerequisites
- A GitHub account
- A Vercel account (sign up at https://vercel.com)

## Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project Settings:**
   - Framework Preset: **Other**
   - Root Directory: `.` (default)
   - Build Command: Leave empty
   - Output Directory: `.` (default)
   - Install Command: `npm install`

4. **Add Environment Variable (for Blob Storage):**
   - After first deployment, go to Project Settings → Environment Variables
   - You'll add `BLOB_READ_WRITE_TOKEN` after creating Blob storage (see step 5)

5. **Set up Blob Storage (for persistent messages):**
   - In your Vercel project dashboard, go to **Storage** tab
   - Click **Create Database** → Select **Blob**
   - Create a new Blob store (name it "messages" or similar)
   - Vercel will automatically add `BLOB_READ_WRITE_TOKEN` to your environment variables
   - **Redeploy** your project for the token to take effect

6. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at `https://your-project.vercel.app`

## Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - For production deployment: `vercel --prod`

4. **Set up Blob Storage:**
   - Go to your Vercel dashboard
   - Navigate to your project → Storage tab
   - Create a Blob store
   - Redeploy: `vercel --prod`

## Important Notes

- **Without Blob Storage:** The site will work, but messages will only be stored in the browser's localStorage (not persistent across devices)
- **With Blob Storage:** Messages are stored persistently in Vercel Blob and accessible from any device
- The API endpoint `/api/messages` will automatically use Blob storage when `BLOB_READ_WRITE_TOKEN` is available

## Troubleshooting

- If messages aren't saving: Check that Blob storage is created and `BLOB_READ_WRITE_TOKEN` is set
- Check Vercel function logs: Project → Functions → View logs
- Ensure all files are committed to git before deploying
