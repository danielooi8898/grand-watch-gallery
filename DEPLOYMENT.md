# Deployment Guide

## Environment Variables Setup

### Local Development
Environment variables are stored in `.env.local` and are automatically loaded by Next.js.

### Vercel Deployment
When deploying to Vercel, you must configure environment variables in the Vercel dashboard.

## Required Environment Variables

### AI Agent (Claude API)
The AI Agent feature requires an Anthropic API key:

1. **Get your API key:**
   - Go to https://console.anthropic.com/account/keys
   - Create a new API key
   - Copy the key

2. **Add to Vercel:**
   - Go to https://vercel.com/dashboard
   - Select your project: `grand-watch-gallery`
   - Go to **Settings** → **Environment Variables**
   - Add a new variable:
     - **Name:** `ANTHROPIC_API_KEY`
     - **Value:** `sk-ant-api03-...` (your API key)
     - **Environments:** Production, Preview, Development
   - Click **Save**

3. **Redeploy:**
   - After adding the environment variable, redeploy your project
   - Go to **Deployments** and click **Redeploy** on the latest deployment
   - Or push a new commit to trigger automatic deployment

## Optional Environment Variables

### Email Service (Resend)
- `RESEND_API_KEY` - Get from https://resend.com/api-keys
- `RESEND_FROM` - Your email address for notifications

### OpenAI
- `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys

## Verifying Setup
After deploying:
1. Open the AI Agent (click the "AI" button in admin panel)
2. Ask a question about your inventory
3. If you get "API key not configured", the environment variable wasn't set correctly
4. Check Vercel deployment logs for errors

## Troubleshooting

**Error: "API key not configured"**
- Verify the environment variable is set in Vercel Settings
- Make sure you redeployed after adding the variable
- Check the variable name is exactly `ANTHROPIC_API_KEY`

**Error: "Invalid API key"**
- Make sure you copied the entire API key correctly
- Check that the key starts with `sk-ant-api03-`
- Try generating a new key from the Anthropic console

**Error: 403 Forbidden**
- The API key may have expired or been revoked
- Generate a new key from https://console.anthropic.com/account/keys
- Update it in Vercel Settings and redeploy
