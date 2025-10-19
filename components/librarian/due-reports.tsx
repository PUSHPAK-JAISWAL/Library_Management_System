"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLibraryStore } from "@/lib/store"
import { calculateFine, getDaysOverdue } from "@/lib/fine-calculator"
import { useFineTracker } from "@/hooks/use-fine-tracker"

export function DueReports() {
  const { issuedBooks, books, users } = useLibraryStore()
  useFineTracker() // Initialize fine tracker

  const overdueBooks = useMemo(() => {
    return issuedBooks
      .filter((ib) => ib.status === "issued")
      .map((ib) => ({
        ...ib,
        fine: calculateFine(ib.dueDate),
        daysOverdue: getDaysOverdue(ib.dueDate),
        book: books.find((b) => b.id === ib.bookId),
        student: users.find((u) => u.id === ib.studentId),
      }))
      .filter((ib) => ib.fine > 0)
      .sort((a, b) => b.fine - a.fine)
  }, [issuedBooks, books, users])

  const totalFines = overdueBooks.reduce((sum, ib) => sum + ib.fine, 0)
  const totalDaysOverdue = overdueBooks.reduce((sum, ib) => sum + ib.daysOverdue, 0)

  const handleExportReport = () => {
    const reportData = overdueBooks.map((ib) => ({
      "Student Name": ib.student?.name,
      "Student ID": ib.student?.studentId,
      "Book Title": ib.book?.title,
      "Due Date": new Date(ib.dueDate).toLocaleDateString(),
      "Days Overdue": ib.daysOverdue,
      "Fine (₹)": ib.fine,
    }))

    const csv = [
      Object.keys(reportData[0] || {}).join(","),
      ...reportData.map((row) => Object.values(row).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `due-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Due Reports</h2>
        <Button onClick={handleExportReport} disabled={overdueBooks.length === 0}>
          Export as CSV
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Total Outstanding Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">₹{totalFines}</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Overdue Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{overdueBooks.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Days Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalDaysOverdue}</p>
          </CardContent>
        </Card>
      </div>

      {overdueBooks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No overdue books</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {overdueBooks.map((issued) => (
            <Card key={issued.id} className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-lg">{issued.book?.title}</CardTitle>
                <CardDescription>
                  {issued.student?.name} ({issued.student?.studentId})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-semibold">{new Date(issued.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Days Overdue</p>
                    <p className="font-semibold text-destructive">{issued.daysOverdue}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fine Rate</p>
                    <p className="font-semibold">₹10/day</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Fine</p>
                    <p className="font-semibold text-destructive">₹{issued.fine}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-semibold text-sm">{issued.student?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
