"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLibraryStore } from "@/lib/store"

export function BookingManagement() {
  const { bookings, books, users, updateBooking, issueBook } = useLibraryStore()

  const pendingBookings = bookings.filter((b) => b.status === "pending")

  const handlePickup = (booking) => {
    updateBooking(booking.id, { status: "picked" })

    const student = users.find((u) => u.id === booking.studentId)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 7)

    const issuedBook = {
      id: `issued_${Date.now()}`,
      bookId: booking.bookId,
      studentId: booking.studentId,
      issuedBy: "librarian",
      issuedDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      fine: 0,
      status: "issued" as const,
    }

    issueBook(issuedBook)
  }

  const handleCancel = (bookingId) => {
    updateBooking(bookingId, { status: "cancelled" })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Manage Bookings</h2>

      {pendingBookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No pending bookings</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingBookings.map((booking) => {
            const book = books.find((b) => b.id === booking.bookId)
            const student = users.find((u) => u.id === booking.studentId)
            const pickupDeadline = new Date(booking.pickupDeadline)
            const isExpired = new Date() > pickupDeadline

            return (
              <Card key={booking.id} className={isExpired ? "border-destructive" : ""}>
                <CardHeader>
                  <CardTitle>{book?.title}</CardTitle>
                  <CardDescription>
                    Student: {student?.name} ({student?.studentId})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Booked On</p>
                      <p className="font-semibold">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pickup Deadline</p>
                      <p className={`font-semibold ${isExpired ? "text-destructive" : ""}`}>
                        {pickupDeadline.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-semibold">{book?.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handlePickup(booking)} className="flex-1">
                      Mark as Picked Up
                    </Button>
                    <Button variant="destructive" onClick={() => handleCancel(booking.id)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
