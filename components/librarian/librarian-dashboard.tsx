"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookManagement } from "./book-management"
import { IssueReturn } from "./issue-return"
import { BookingManagement } from "./booking-management"
import { DueReports } from "./due-reports"

export function LibrarianDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("books")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Library Management</h1>
            <p className="text-sm text-muted-foreground">Librarian Dashboard - {user.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="books">Manage Books</TabsTrigger>
            <TabsTrigger value="issue">Issue/Return</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reports">Due Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="mt-6">
            <BookManagement />
          </TabsContent>

          <TabsContent value="issue" className="mt-6">
            <IssueReturn librarianId={user.id} />
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <BookingManagement />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <DueReports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
