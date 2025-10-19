"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLibraryStore } from "@/lib/store"
import { calculateFine } from "@/lib/fine-calculator"
import { Input } from "@/components/ui/input"

export function SystemReports() {
  const { users, books, issuedBooks, bookings, transactionHistory, deleteOldTransactions, getTransactionsByDateRange } =
    useLibraryStore()
  const [deleteBeforeDate, setDeleteBeforeDate] = useState("")
  const [reportStartDate, setReportStartDate] = useState("")
  const [reportEndDate, setReportEndDate] = useState("")

  const stats = useMemo(() => {
    const students = users.filter((u) => u.role === "student").length
    const librarians = users.filter((u) => u.role === "librarian").length
    const totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0)
    const issuedCount = issuedBooks.filter((ib) => ib.status === "issued").length
    const overdueCount = issuedBooks.filter((ib) => {
      const dueDate = new Date(ib.dueDate)
      return ib.status === "issued" && new Date() > dueDate
    }).length
    const totalFines = issuedBooks.reduce((sum, ib) => sum + calculateFine(ib.dueDate), 0)
    const returnedCount = issuedBooks.filter((ib) => ib.status === "returned").length

    return {
      students,
      librarians,
      totalBooks,
      issuedCount,
      overdueCount,
      bookings: bookings.filter((b) => b.status === "pending").length,
      totalFines,
      returnedCount,
    }
  }, [users, books, issuedBooks, bookings])

  const handlePrintReport = () => {
    const printWindow = window.open("", "", "height=600,width=800")
    if (!printWindow) return

    const reportHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Library Management Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #007bff; color: white; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .stat-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #007bff; }
            .stat-label { color: #666; font-size: 14px; }
            .footer { margin-top: 30px; text-align: center; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Library Management System - Monthly Report</h1>
          <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
          
          <h2>Summary Statistics</h2>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-label">Total Students</div>
              <div class="stat-value">${stats.students}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Total Librarians</div>
              <div class="stat-value">${stats.librarians}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Total Books</div>
              <div class="stat-value">${stats.totalBooks}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Available Books</div>
              <div class="stat-value">${books.reduce((sum, b) => sum + b.availableCopies, 0)}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Currently Issued</div>
              <div class="stat-value">${stats.issuedCount}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Returned Books</div>
              <div class="stat-value">${stats.returnedCount}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Overdue Books</div>
              <div class="stat-value" style="color: #dc3545;">${stats.overdueCount}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Total Fines (₹)</div>
              <div class="stat-value" style="color: #dc3545;">₹${stats.totalFines}</div>
            </div>
          </div>

          <h2>Circulation Metrics</h2>
          <table>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Circulation Rate</td>
              <td>${stats.totalBooks > 0 ? ((stats.issuedCount / stats.totalBooks) * 100).toFixed(1) : 0}%</td>
            </tr>
            <tr>
              <td>Return Rate</td>
              <td>${stats.issuedCount + stats.returnedCount > 0 ? ((stats.returnedCount / (stats.issuedCount + stats.returnedCount)) * 100).toFixed(1) : 0}%</td>
            </tr>
            <tr>
              <td>Average Books per Student</td>
              <td>${stats.students > 0 ? (stats.issuedCount / stats.students).toFixed(1) : 0}</td>
            </tr>
            <tr>
              <td>Overdue Percentage</td>
              <td>${stats.issuedCount > 0 ? ((stats.overdueCount / stats.issuedCount) * 100).toFixed(1) : 0}%</td>
            </tr>
          </table>

          <div class="footer">
            <p>This is an official library management report. Print date: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(reportHTML)
    printWindow.document.close()
    printWindow.print()
  }

  const handleGenerateFullReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: stats,
      users: users.map((u) => ({
        name: u.name,
        email: u.email,
        role: u.role,
        studentId: u.studentId,
      })),
      books: books.map((b) => ({
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        totalCopies: b.totalCopies,
        availableCopies: b.availableCopies,
        location: b.location,
      })),
      issuedBooks: issuedBooks.map((ib) => ({
        bookId: ib.bookId,
        studentId: ib.studentId,
        issuedDate: ib.issuedDate,
        dueDate: ib.dueDate,
        status: ib.status,
        fine: calculateFine(ib.dueDate),
      })),
      transactionHistory: transactionHistory,
    }

    const json = JSON.stringify(report, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `library-report-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  const handleGenerateDateRangeReport = () => {
    if (!reportStartDate || !reportEndDate) {
      alert("Please select both start and end dates")
      return
    }

    const transactions = getTransactionsByDateRange(reportStartDate, reportEndDate)
    const report = {
      generatedAt: new Date().toISOString(),
      dateRange: { startDate: reportStartDate, endDate: reportEndDate },
      transactionCount: transactions.length,
      transactions: transactions,
      summary: {
        totalIssues: transactions.filter((t) => t.type === "issue").length,
        totalReturns: transactions.filter((t) => t.type === "return").length,
        totalFinesCollected: transactions
          .filter((t) => t.type === "return" && t.amount)
          .reduce((sum, t) => sum + (t.amount || 0), 0),
      },
    }

    const json = JSON.stringify(report, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `library-report-${reportStartDate}-to-${reportEndDate}.json`
    a.click()
  }

  const handleDeleteOldTransactions = () => {
    if (!deleteBeforeDate) {
      alert("Please select a date")
      return
    }

    if (window.confirm(`Delete all transactions before ${deleteBeforeDate}? This action cannot be undone.`)) {
      deleteOldTransactions(deleteBeforeDate)
      alert("Old transactions deleted successfully")
      setDeleteBeforeDate("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">System Reports</h2>
        <div className="flex gap-2">
          <Button onClick={handlePrintReport} variant="outline">
            Print Report
          </Button>
          <Button onClick={handleGenerateFullReport}>Download Full Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.students}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Librarians</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.librarians}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalBooks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{books.reduce((sum, b) => sum + b.availableCopies, 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Currently Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.issuedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Returned Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.returnedCount}</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Overdue Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{stats.overdueCount}</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Total Fines (₹)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{stats.totalFines}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.bookings}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Library Statistics</CardTitle>
          <CardDescription>Overview of library operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded">
              <p className="text-sm text-muted-foreground">Circulation Rate</p>
              <p className="text-2xl font-bold">
                {stats.totalBooks > 0 ? ((stats.issuedCount / stats.totalBooks) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Books in circulation</p>
            </div>

            <div className="p-4 bg-muted rounded">
              <p className="text-sm text-muted-foreground">Return Rate</p>
              <p className="text-2xl font-bold">
                {stats.issuedCount + stats.returnedCount > 0
                  ? ((stats.returnedCount / (stats.issuedCount + stats.returnedCount)) * 100).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-muted-foreground mt-1">Books returned on time</p>
            </div>

            <div className="p-4 bg-muted rounded">
              <p className="text-sm text-muted-foreground">Average Books per Student</p>
              <p className="text-2xl font-bold">
                {stats.students > 0 ? (stats.issuedCount / stats.students).toFixed(1) : 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Currently issued</p>
            </div>

            <div className="p-4 bg-muted rounded">
              <p className="text-sm text-muted-foreground">Overdue Percentage</p>
              <p className="text-2xl font-bold text-destructive">
                {stats.issuedCount > 0 ? ((stats.overdueCount / stats.issuedCount) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Of issued books</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate Monthly Report</CardTitle>
          <CardDescription>Generate reports for a specific date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Start Date</label>
              <Input type="date" value={reportStartDate} onChange={(e) => setReportStartDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">End Date</label>
              <Input type="date" value={reportEndDate} onChange={(e) => setReportEndDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerateDateRangeReport} className="w-full">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Data Management</CardTitle>
          <CardDescription>Delete old transaction records to manage storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Delete transactions before:</label>
              <Input type="date" value={deleteBeforeDate} onChange={(e) => setDeleteBeforeDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={handleDeleteOldTransactions} variant="destructive" className="w-full">
                Delete Old Records
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Warning: This will permanently delete all transaction records before the selected date. Make sure to
            download your reports first.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
