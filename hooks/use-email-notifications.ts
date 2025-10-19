"use client"

import { useCallback } from "react"
import { useLibraryStore } from "@/lib/store"
import { emailScheduler } from "@/lib/email-scheduler"

export function useEmailNotifications() {
  const { issuedBooks, bookings, users, books } = useLibraryStore()

  const scheduleIssueEmail = useCallback(
    (issuedBook: any) => {
      const student = users.find((u) => u.id === issuedBook.studentId)
      const book = books.find((b) => b.id === issuedBook.bookId)

      if (student?.email) {
        const email = {
          id: `email_issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          to: student.email,
          subject: `Book Issued: ${book?.title}`,
          message: `Your book "${book?.title}" has been issued. Due date: ${new Date(issuedBook.dueDate).toLocaleDateString()}`,
          type: "issue" as const,
          scheduledFor: new Date().toISOString(),
          sent: false,
        }
        emailScheduler.scheduleEmail(email)
      }
    },
    [users, books],
  )

  const scheduleReminderEmail = useCallback(
    (issuedBook: any) => {
      const student = users.find((u) => u.id === issuedBook.studentId)
      const book = books.find((b) => b.id === issuedBook.bookId)
      const dueDate = new Date(issuedBook.dueDate)
      const reminderDate = new Date(dueDate.getTime() - 2 * 60 * 1000)

      if (student?.email) {
        const email = {
          id: `email_reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          to: student.email,
          subject: `Reminder: Book Due Soon - ${book?.title}`,
          message: `Reminder: Your book "${book?.title}" is due on ${dueDate.toLocaleDateString()}. Please return it on time to avoid fines.`,
          type: "reminder" as const,
          scheduledFor: reminderDate.toISOString(),
          sent: false,
        }
        emailScheduler.scheduleEmail(email)
      }
    },
    [users, books],
  )

  const scheduleDueEmail = useCallback(
    (issuedBook: any) => {
      const student = users.find((u) => u.id === issuedBook.studentId)
      const book = books.find((b) => b.id === issuedBook.bookId)
      const dueDate = new Date(issuedBook.dueDate)

      if (student?.email) {
        const email = {
          id: `email_due_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          to: student.email,
          subject: `Book Overdue: ${book?.title}`,
          message: `Your book "${book?.title}" is now overdue. Fine: ₹10 per day. Please return it immediately.`,
          type: "due" as const,
          scheduledFor: new Date(dueDate.getTime() + 1000).toISOString(),
          sent: false,
        }
        emailScheduler.scheduleEmail(email)
      }
    },
    [users, books],
  )

  const scheduleBookingConfirmation = useCallback(
    (booking: any) => {
      const student = users.find((u) => u.id === booking.studentId)
      const book = books.find((b) => b.id === booking.bookId)

      if (student?.email) {
        const email = {
          id: `email_booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          to: student.email,
          subject: `Booking Confirmed: ${book?.title}`,
          message: `Your booking for "${book?.title}" is confirmed. Please pick it up within 6 hours from ${new Date(booking.bookingDate).toLocaleString()}. Location: ${book?.location}`,
          type: "issue" as const,
          scheduledFor: new Date().toISOString(),
          sent: false,
        }
        emailScheduler.scheduleEmail(email)
      }
    },
    [users, books],
  )

  const scheduleReturnEmail = useCallback(
    (issuedBook: any) => {
      const student = users.find((u) => u.id === issuedBook.studentId)
      const book = books.find((b) => b.id === issuedBook.bookId)

      if (student?.email) {
        const email = {
          id: `email_return_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          to: student.email,
          subject: `Book Return Confirmed: ${book?.title}`,
          message: `Your book "${book?.title}" has been successfully returned. Thank you for using our library!`,
          type: "return" as const,
          scheduledFor: new Date().toISOString(),
          sent: false,
        }
        emailScheduler.scheduleEmail(email)
      }
    },
    [users, books],
  )

  const scheduleReissueEmail = useCallback(
    (issuedBook: any) => {
      const student = users.find((u) => u.id === issuedBook.studentId)
      const book = books.find((b) => b.id === issuedBook.bookId)

      if (student?.email) {
        const email = {
          id: `email_reissue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          to: student.email,
          subject: `Book Reissued: ${book?.title}`,
          message: `Your book "${book?.title}" has been reissued. New due date: ${new Date(issuedBook.dueDate).toLocaleDateString()}. Any previous fines have been cleared.`,
          type: "issue" as const,
          scheduledFor: new Date().toISOString(),
          sent: false,
        }
        emailScheduler.scheduleEmail(email)
      }
    },
    [users, books],
  )

  return {
    scheduleIssueEmail,
    scheduleReminderEmail,
    scheduleDueEmail,
    scheduleBookingConfirmation,
    scheduleReturnEmail,
    scheduleReissueEmail,
  }
}
