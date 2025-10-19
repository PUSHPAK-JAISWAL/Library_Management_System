import { sendEmailViaResend } from "@/app/actions/email-config"

interface ScheduledEmail {
  id: string
  to: string
  subject: string
  message: string
  type: "issue" | "reminder" | "due" | "return" | "booking" | "reissue"
  scheduledFor: string
  sent: boolean
  sentAt?: string
}

class EmailScheduler {
  private emails: ScheduledEmail[] = []
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  constructor() {
    console.log(`[EMAIL] Email scheduler initialized (SMTP Mode - Real emails via Gmail)`)
  }

  scheduleEmail(email: ScheduledEmail) {
    this.emails.push(email)
    this.setupEmailCheck(email.id)
  }

  private setupEmailCheck(emailId: string) {
    const email = this.emails.find((e) => e.id === emailId)
    if (!email) return

    const checkInterval = setInterval(() => {
      const now = new Date()
      const scheduledTime = new Date(email.scheduledFor)

      if (now >= scheduledTime && !email.sent) {
        this.sendEmail(emailId)
        clearInterval(checkInterval)
        this.intervals.delete(emailId)
      }
    }, 1000)

    this.intervals.set(emailId, checkInterval)
  }

  private async sendEmail(emailId: string) {
    const email = this.emails.find((e) => e.id === emailId)
    if (!email) return

    email.sent = true
    email.sentAt = new Date().toISOString()

    try {
      const result = await sendEmailViaResend(email.to, email.subject, email.message, email.type)

      if (result.success) {
        console.log(`[EMAIL SENT] To: ${email.to}, Subject: ${email.subject}`)
      } else {
        console.log(`[EMAIL ERROR] Failed to send email to ${email.to}: ${result.error}`)
      }
    } catch (error) {
      console.log(`[EMAIL ERROR] Error sending email to ${email.to}:`, error)
    }

    // Store sent emails in localStorage
    const sentEmails = JSON.parse(localStorage.getItem("sentEmails") || "[]")
    sentEmails.push(email)
    localStorage.setItem("sentEmails", JSON.stringify(sentEmails))
  }

  getScheduledEmails() {
    return this.emails
  }

  getSentEmails() {
    return JSON.parse(localStorage.getItem("sentEmails") || "[]")
  }

  clearInterval(emailId: string) {
    const interval = this.intervals.get(emailId)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(emailId)
    }
  }
}

export const emailScheduler = new EmailScheduler()
