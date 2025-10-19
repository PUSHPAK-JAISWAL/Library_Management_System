"use client"

import { useLibraryStore } from "@/lib/store"
import { useEmailNotifications } from "@/hooks/use-email-notifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MyBookings({ user }) {
  const { bookings, books, updateBooking } = useLibraryStore()
  const { scheduleBookingConfirmation } = useEmailNotifications()

  const myBookings = bookings.filter((b) => b.studentId === user.id)

  const handleCancelBooking = (bookingId) => {
    updateBooking(bookingId, { status: "cancelled" })
  }

  const handleBookNow = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (booking && booking.status === "pending") {
      scheduleBookingConfirmation(booking)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">My Bookings</h2>

      {myBookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No active bookings</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {myBookings.map((booking) => {
            const book = books.find((b) => b.id === booking.bookId)
            const pickupTime = new Date(booking.pickupDeadline)
            const isExpired = new Date() > pickupTime

            return (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle>{book?.title}</CardTitle>
                  <CardDescription>
                    Status: <span className="capitalize font-semibold">{booking.status}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Booked On</p>
                      <p className="font-semibold">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pickup Deadline</p>
                      <p
                        className={`font-semibold ${isExpired && booking.status === "pending" ? "text-destructive" : ""}`}
                      >
                        {pickupTime.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {booking.status === "pending" && (
                    <Button variant="destructive" onClick={() => handleCancelBooking(booking.id)} className="w-full">
                      Cancel Booking
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
