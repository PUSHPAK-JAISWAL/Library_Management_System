# Email Configuration Guide

This Library Management System uses **EmailJS** to send emails directly from the client-side. Follow these steps to set up email functionality.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up for a free account
3. Verify your email

## Step 2: Connect Gmail Account

1. In EmailJS Dashboard, go to **Email Services**
2. Click **Add Service**
3. Select **Gmail**
4. Click **Connect Account** and authorize your Gmail account
5. Copy your **Service ID** (looks like: `service_xxxxx`)

## Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template:

\`\`\`
Subject: {{subject}}

{{message}}

---
Library Management System
\`\`\`

4. Set the template variables:
   - `to_email` → recipient email
   - `subject` → email subject
   - `message` → email body
   - `reply_to` → reply-to email

5. Copy your **Template ID** (looks like: `template_xxxxx`)

## Step 4: Get Your Public Key

1. Go to **Account** → **API Keys**
2. Copy your **Public Key** (looks like: `xxxxx_xxxxxxxxxxxxxxx`)

## Step 5: Add Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_GMAIL_SENDER_EMAIL=your_email@gmail.com
\`\`\`

Replace with your actual values from EmailJS.

## Step 6: Test Email Sending

1. Start your development server: `npm run dev`
2. Log in as a student
3. Book a book or perform any action that triggers an email
4. Check the **Email Log** (visible to librarians/admins) to see sent emails
5. Check your inbox for the email

## Troubleshooting

- **Emails not sending?** Check that all environment variables are correctly set
- **Template not found?** Verify your Template ID is correct
- **Service not found?** Verify your Service ID is correct
- **Check console logs** for detailed error messages

## Email Events

Emails are automatically sent for:
- ✅ Book Booking Confirmation
- ✅ Book Issue Notification
- ✅ Book Return Confirmation
- ✅ Book Reissue Notification
- ✅ Due Date Reminder (2 minutes before due date)

All emails are logged in the Email Log for tracking purposes.
