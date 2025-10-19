"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLibraryStore } from "@/lib/store"
import { useEmailNotifications } from "@/hooks/use-email-notifications"

export function BookBrowser({ user }) {
  const [searchTerm, setSearchTerm] = useState("")
  const { books, createBooking, addNotification } = useLibraryStore()
  const { scheduleBookingConfirmation } = useEmailNotifications()

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm),
  )

  const handleBookBook = (book) => {
    const booking = {
      id: `booking_${Date.now()}`,
      bookId: book.id,
      studentId: user.id,
      bookingDate: new Date().toISOString(),
      pickupDeadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      status: "pending" as const,
    }

    createBooking(booking)

    scheduleBookingConfirmation(booking)

    addNotification({
      id: `notif_${Date.now()}`,
      message: `Book "${book.title}" booked! Pick it up within 6 hours.`,
      type: "success",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Browse Books</h2>
        <Input
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted overflow-hidden">
              <img
                src={book.imageUrl || "/placeholder.svg"}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/abstract-book-cover.png"
                }}
              />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2">{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p>
                  <strong>ISBN:</strong> {book.isbn}
                </p>
                <p>
                  <strong>Location:</strong> {book.location}
                </p>
                <p>
                  <strong>Available:</strong> {book.availableCopies} / {book.totalCopies}
                </p>
              </div>
              <Button onClick={() => handleBookBook(book)} disabled={book.availableCopies === 0} className="w-full">
                {book.availableCopies > 0 ? "Book Now" : "Out of Stock"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No books found matching your search.</p>
        </div>
      )}
    </div>
  )
}
