"use client"

import { useLibraryStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateFine, getDaysOverdue, getDaysUntilDue } from "@/lib/fine-calculator"
import { useFineTracker } from "@/hooks/use-fine-tracker"

export function DuesTracker({ user }) {
  const { issuedBooks, books } = useLibraryStore()
  useFineTracker() // Initialize fine tracker

  const myIssuedBooks = issuedBooks.filter((ib) => ib.studentId === user.id)
  const totalFine = myIssuedBooks.reduce((sum, ib) => sum + calculateFine(ib.dueDate), 0)
  const overdueCount = myIssuedBooks.filter((ib) => getDaysOverdue(ib.dueDate) > 0).length

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Dues & Fines</h2>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Total Outstanding Fine</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">₹{totalFine}</p>
            <p className="text-sm text-muted-foreground mt-2">Fine: ₹10 per day after 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Overdue Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-destructive">{overdueCount}</p>
            <p className="text-sm text-muted-foreground mt-2">Books past due date</p>
          </CardContent>
        </Card>
      </div>

      {myIssuedBooks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No issued books</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {myIssuedBooks.map((issued) => {
            const book = books.find((b) => b.id === issued.bookId)
            const dueDate = new Date(issued.dueDate)
            const fine = calculateFine(issued.dueDate)
            const daysOverdue = getDaysOverdue(issued.dueDate)
            const daysUntilDue = getDaysUntilDue(issued.dueDate)

            return (
              <Card key={issued.id} className={fine > 0 ? "border-destructive/50" : ""}>
                <CardHeader>
                  <CardTitle className="text-lg">{book?.title}</CardTitle>
                  <CardDescription>
                    Status:{" "}
                    <span className={`font-semibold ${fine > 0 ? "text-destructive" : "text-green-600"}`}>
                      {fine > 0 ? "Overdue" : "On Time"}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Due Date</p>
                      <p className="font-semibold">{dueDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{fine > 0 ? "Days Overdue" : "Days Until Due"}</p>
                      <p className={`font-semibold ${fine > 0 ? "text-destructive" : ""}`}>
                        {fine > 0 ? daysOverdue : daysUntilDue}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fine Rate</p>
                      <p className="font-semibold">₹10/day</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Fine</p>
                      <p className={`font-semibold ${fine > 0 ? "text-destructive" : ""}`}>₹{fine}</p>
                    </div>
                  </div>

                  {fine > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
                      <p className="text-xs text-destructive font-semibold">
                        ⚠️ Please return this book immediately to avoid additional fines.
                      </p>
                    </div>
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
