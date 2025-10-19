interface ScheduledEmail {
  id: string
  to: string
  subject: string
  message: string
  type: "issue" | "reminder" | "due" | "return"
  scheduledFor: string
  sent: boolean
  sentAt?: string
}

class EmailScheduler {
  private emails: ScheduledEmail[] = []
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private gmailConfig: { apiKey?: string; senderEmail?: string } = {}

  setGmailConfig(apiKey: string, senderEmail: string) {
    this.gmailConfig = { apiKey, senderEmail }
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

  private sendEmail(emailId: string) {
    const email = this.emails.find((e) => e.id === emailId)
    if (!email) return

    email.sent = true
    email.sentAt = new Date().toISOString()

    if (this.gmailConfig.apiKey) {
      this.sendViaGmail(email)
    } else {
      this.logEmailLocally(email)
    }

    // Store sent emails in localStorage
    const sentEmails = JSON.parse(localStorage.getItem("sentEmails") || "[]")
    sentEmails.push(email)
    localStorage.setItem("sentEmails", JSON.stringify(sentEmails))
  }

  private sendViaGmail(email: ScheduledEmail) {
    // Gmail API integration - user will configure their own API key
    console.log(`[GMAIL SENDING] To: ${email.to}`)
    console.log(`Subject: ${email.subject}`)
    console.log(`Message: ${email.message}`)
    // In production, this would call Gmail API with the configured API key
  }

  private logEmailLocally(email: ScheduledEmail) {
    console.log(`[EMAIL SCHEDULED] To: ${email.to}`)
    console.log(`Subject: ${email.subject}`)
    console.log(`Message: ${email.message}`)
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
