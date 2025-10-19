"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { emailScheduler } from "@/lib/email-scheduler"

export function EmailLog() {
  const [sentEmails, setSentEmails] = useState([])
  const [scheduledEmails, setScheduledEmails] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      setSentEmails(emailScheduler.getSentEmails())
      setScheduledEmails(emailScheduler.getScheduledEmails())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Emails</CardTitle>
          <CardDescription>Emails waiting to be sent</CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledEmails.filter((e) => !e.sent).length === 0 ? (
            <p className="text-sm text-muted-foreground">No scheduled emails</p>
          ) : (
            <div className="space-y-2">
              {scheduledEmails
                .filter((e) => !e.sent)
                .map((email) => (
                  <div key={email.id} className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                    <p className="font-semibold text-blue-900">{email.subject}</p>
                    <p className="text-blue-800">To: {email.to}</p>
                    <p className="text-xs text-blue-700">Scheduled: {new Date(email.scheduledFor).toLocaleString()}</p>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sent Emails</CardTitle>
          <CardDescription>Emails that have been sent</CardDescription>
        </CardHeader>
        <CardContent>
          {sentEmails.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sent emails</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sentEmails.map((email) => (
                <div key={email.id} className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                  <p className="font-semibold text-green-900">{email.subject}</p>
                  <p className="text-green-800">To: {email.to}</p>
                  <p className="text-xs text-green-700">Sent: {new Date(email.sentAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
