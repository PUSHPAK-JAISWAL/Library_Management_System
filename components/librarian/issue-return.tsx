"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLibraryStore } from "@/lib/store"
import { useEmailNotifications } from "@/hooks/use-email-notifications"

export function IssueReturn({ librarianId }) {
  const [searchType, setSearchType] = useState("student")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [dueDays, setDueDays] = useState(7)
  const [action, setAction] = useState("issue")

  const { users, books, issuedBooks, issueBook, returnBook, reissueBook, addNotification } = useLibraryStore()
  const { scheduleIssueEmail, scheduleReminderEmail, scheduleReturnEmail, scheduleReissueEmail } =
    useEmailNotifications()

  const filteredUsers = users.filter(
    (u) =>
      u.role === "student" &&
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.studentId?.includes(searchTerm)),
  )

  const filteredBooks = books.filter(
    (b) => b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.isbn.includes(searchTerm),
  )

  const handleIssueBook = () => {
    if (!selectedStudent || !selectedBook) return

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + dueDays)

    const issuedBook = {
      id: `issued_${Date.now()}`,
      bookId: selectedBook.id,
      studentId: selectedStudent.id,
      issuedBy: librarianId,
      issuedDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      fine: 0,
      status: "issued" as const,
    }

    issueBook(issuedBook)

    scheduleIssueEmail(issuedBook)
    scheduleReminderEmail(issuedBook)

    addNotification({
      id: `notif_${Date.now()}`,
      message: `Book "${selectedBook.title}" issued to ${selectedStudent.name}. Due: ${dueDate.toLocaleDateString()}`,
      type: "success",
    })

    setSelectedStudent(null)
    setSelectedBook(null)
    setSearchTerm("")
    setDueDays(7)
  }

  const handleReturnBook = (issuedBookId) => {
    const issued = issuedBooks.find((ib) => ib.id === issuedBookId)
    returnBook(issuedBookId)

    if (issued) {
      scheduleReturnEmail(issued)
    }

    addNotification({
      id: `notif_${Date.now()}`,
      message: "Book returned successfully",
      type: "success",
    })
  }

  const handleReissueBook = (issuedBookId) => {
    const issued = issuedBooks.find((ib) => ib.id === issuedBookId)
    reissueBook(issuedBookId)
    const student = users.find((u) => u.id === issued?.studentId)

    if (issued) {
      scheduleReissueEmail(issued)
    }

    addNotification({
      id: `notif_${Date.now()}`,
      message: `Book reissued to ${student?.name}. New due date is 7 days from now.`,
      type: "success",
    })
  }

  const studentIssuedBooks = selectedStudent
    ? issuedBooks.filter((ib) => ib.studentId === selectedStudent.id && ib.status !== "returned")
    : []

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Issue / Return / Reissue Books</h2>

      <div className="grid grid-cols-3 gap-6">
        {/* Issue Book Section */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Book</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Search Student</label>
              <Input
                placeholder="Name, Email, or Student ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedStudent(user)
                        setSearchTerm("")
                      }}
                      className="w-full text-left p-2 hover:bg-muted rounded border border-border"
                    >
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.studentId} - {user.email}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedStudent && (
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">{selectedStudent.name}</p>
                <p className="text-sm text-muted-foreground">{selectedStudent.studentId}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground">Search Book</label>
              <Input placeholder="Title or ISBN" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {searchTerm && (
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {filteredBooks.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => {
                        setSelectedBook(book)
                        setSearchTerm("")
                      }}
                      className="w-full text-left p-2 hover:bg-muted rounded border border-border"
                    >
                      <p className="font-semibold">{book.title}</p>
                      <p className="text-xs text-muted-foreground">Available: {book.availableCopies}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedBook && (
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">{selectedBook.title}</p>
                <p className="text-sm text-muted-foreground">Available: {selectedBook.availableCopies}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground">Due Date (Days)</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min="1"
                  max="7"
                  value={dueDays}
                  onChange={(e) => setDueDays(Math.max(1, Math.min(7, Number.parseInt(e.target.value) || 1)))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">{dueDays} days</span>
              </div>
            </div>

            <Button onClick={handleIssueBook} disabled={!selectedStudent || !selectedBook} className="w-full">
              Issue Book
            </Button>
          </CardContent>
        </Card>

        {/* Return Book Section */}
        <Card>
          <CardHeader>
            <CardTitle>Return Book</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedStudent && studentIssuedBooks.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Books issued to {selectedStudent.name}:</p>
                {studentIssuedBooks.map((issued) => {
                  const book = books.find((b) => b.id === issued.bookId)
                  return (
                    <div key={issued.id} className="p-3 bg-muted rounded flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{book?.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Issued: {new Date(issued.issuedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => handleReturnBook(issued.id)}>
                        Return
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {selectedStudent ? "No issued books" : "Select a student first"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Reissue Book Section */}
        <Card>
          <CardHeader>
            <CardTitle>Reissue Book</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedStudent && studentIssuedBooks.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Books to reissue:</p>
                {studentIssuedBooks.map((issued) => {
                  const book = books.find((b) => b.id === issued.bookId)
                  const dueDate = new Date(issued.dueDate)
                  const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

                  return (
                    <div key={issued.id} className="p-3 bg-muted rounded flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm">{book?.title}</p>
                        <p className="text-xs text-muted-foreground">Due in {daysUntilDue} days</p>
                      </div>
                      <Button size="sm" onClick={() => handleReissueBook(issued.id)} variant="outline">
                        Reissue
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {selectedStudent ? "No issued books" : "Select a student first"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
