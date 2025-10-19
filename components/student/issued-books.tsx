"use client"

import { useLibraryStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useEmailNotifications } from "@/hooks/use-email-notifications"

export function IssuedBooks({ user }) {
  const { issuedBooks, books, reissueBook, addNotification } = useLibraryStore()
  const { scheduleReminderEmail } = useEmailNotifications()

  useEffect(() => {
    const myIssuedBooks = issuedBooks.filter((ib) => ib.studentId === user.id && ib.status !== "returned")
    myIssuedBooks.forEach((book) => {
      scheduleReminderEmail(book)
    })
  }, [issuedBooks, user.id, scheduleReminderEmail])

  const myIssuedBooks = issuedBooks.filter((ib) => ib.studentId === user.id && ib.status !== "returned")

  const handleReissue = (issuedBookId) => {
    reissueBook(issuedBookId)
    addNotification({
      id: `notif_${Date.now()}`,
      message: "Book reissued successfully! New due date is 7 days from now.",
      type: "success",
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">My Issued Books</h2>

      {myIssuedBooks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No active issued books</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {myIssuedBooks.map((issued) => {
            const book = books.find((b) => b.id === issued.bookId)
            const dueDate = new Date(issued.dueDate)
            const isOverdue = new Date() > dueDate
            const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

            return (
              <Card key={issued.id} className={isOverdue ? "border-destructive" : ""}>
                <CardHeader>
                  <CardTitle>{book?.title}</CardTitle>
                  <CardDescription>
                    Status:{" "}
                    <span className={`capitalize font-semibold ${isOverdue ? "text-destructive" : ""}`}>
                      {issued.status}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Issued Date</p>
                      <p className="font-semibold">{new Date(issued.issuedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Due Date</p>
                      <p className={`font-semibold ${isOverdue ? "text-destructive" : ""}`}>
                        {dueDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="text-muted-foreground">Days Until Due</p>
                    <p className={`font-semibold ${daysUntilDue <= 1 ? "text-orange-600" : ""}`}>{daysUntilDue} days</p>
                  </div>

                  {isOverdue && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
                      <p className="text-sm text-destructive font-semibold">Overdue! Fine: ₹{issued.fine}</p>
                    </div>
                  )}

                  {!isOverdue && daysUntilDue > 0 && (
                    <Button onClick={() => handleReissue(issued.id)} variant="outline" className="w-full">
                      Reissue Book
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
