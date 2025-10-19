# Resend Email Setup Guide

## Step 1: Get Your Resend API Key

1. Go to [Resend Dashboard](https://dashboard.resend.com)
2. Sign in with your account
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy your API key

## Step 2: Configure Your Sender Email

You have two options:

### Option A: Use Resend's Default Email (Easiest)
- Use: `onboarding@resend.dev`
- No additional setup needed
- Perfect for testing

### Option B: Use Your Own Domain
1. In Resend Dashboard, go to **Domains**
2. Add your domain
3. Follow the DNS verification steps
4. Once verified, use your domain email (e.g., `noreply@yourdomain.com`)

## Step 3: Add Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
RESEND_API_KEY=your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
\`\`\`

Or if using your own domain:

\`\`\`env
RESEND_API_KEY=your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
\`\`\`

## Step 4: Test Email Sending

1. Start your development server: `npm run dev`
2. Log in to the application
3. Perform an action that triggers an email (book issue, booking, etc.)
4. Check the console for email logs
5. Check your Resend Dashboard for sent emails

## Troubleshooting

- **"Resend API key not configured"**: Make sure `RESEND_API_KEY` is set in `.env.local`
- **Emails not sending**: Check the Resend Dashboard for error logs
- **Domain verification issues**: Ensure DNS records are properly configured in Resend

## Email Types Configured

- ✅ Book Booking Confirmation
- ✅ Book Issue Notification
- ✅ Book Return Confirmation
- ✅ Book Reissue Notification
- ✅ Due Date Reminder (2 minutes before due)

All emails are sent automatically when actions occur!
