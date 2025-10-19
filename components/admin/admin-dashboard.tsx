"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LibrarianManagement } from "./librarian-management"
import { SystemReports } from "./system-reports"

export function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("librarians")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Library Management</h1>
            <p className="text-sm text-muted-foreground">Admin Dashboard - {user.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="librarians">Manage Librarians</TabsTrigger>
            <TabsTrigger value="reports">System Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="librarians" className="mt-6">
            <LibrarianManagement />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <SystemReports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
