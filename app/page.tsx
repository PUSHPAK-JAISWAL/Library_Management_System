"use client"

import { useEffect, useState } from "react"
import { LoginPage } from "@/components/auth/login-page"
import { StudentDashboard } from "@/components/student/student-dashboard"
import { LibrarianDashboard } from "@/components/librarian/librarian-dashboard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { EmailLog } from "@/components/notifications/email-log"

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEmailLog, setShowEmailLog] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <LoginPage setCurrentUser={setCurrentUser} />
  }

  return (
    <>
      {(currentUser.role === "librarian" || currentUser.role === "admin") && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowEmailLog(!showEmailLog)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-primary/90 text-sm font-medium"
          >
            {showEmailLog ? "Hide" : "Show"} Email Log
          </button>
        </div>
      )}

      {showEmailLog && (
        <div className="fixed bottom-16 right-4 z-50 w-96 max-h-96 bg-background border border-border rounded-lg shadow-lg overflow-y-auto p-4">
          <EmailLog />
        </div>
      )}

      {currentUser.role === "student" && <StudentDashboard user={currentUser} onLogout={handleLogout} />}
      {currentUser.role === "librarian" && <LibrarianDashboard user={currentUser} onLogout={handleLogout} />}
      {currentUser.role === "admin" && <AdminDashboard user={currentUser} onLogout={handleLogout} />}
    </>
  )
}
