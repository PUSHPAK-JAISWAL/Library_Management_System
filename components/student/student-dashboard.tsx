"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookBrowser } from "./book-browser"
import { MyBookings } from "./my-bookings"
import { IssuedBooks } from "./issued-books"
import { DuesTracker } from "./dues-tracker"
import { useLibraryStore } from "@/lib/store"

export function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("browse")
  const { notifications, removeNotification } = useLibraryStore()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Library Management</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user.name} ({user.studentId})
            </p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center"
            >
              <p className="text-sm text-blue-900">{notif.message}</p>
              <button onClick={() => removeNotification(notif.id)} className="text-blue-600 hover:text-blue-800">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Books</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="issued">Issued Books</TabsTrigger>
            <TabsTrigger value="dues">Dues</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <BookBrowser user={user} />
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <MyBookings user={user} />
          </TabsContent>

          <TabsContent value="issued" className="mt-6">
            <IssuedBooks user={user} />
          </TabsContent>

          <TabsContent value="dues" className="mt-6">
            <DuesTracker user={user} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
