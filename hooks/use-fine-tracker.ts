"use client"

import { useEffect, useCallback } from "react"
import { useLibraryStore } from "@/lib/store"
import { calculateFine } from "@/lib/fine-calculator"

export function useFineTracker() {
  const { issuedBooks } = useLibraryStore()

  const updateFines = useCallback(() => {
    issuedBooks.forEach((issuedBook) => {
      if (issuedBook.status === "issued") {
        const newFine = calculateFine(issuedBook.dueDate)
        if (newFine !== issuedBook.fine) {
          // Update fine in store
          const updatedBook = { ...issuedBook, fine: newFine }
          const allBooks = JSON.parse(localStorage.getItem("library-store") || "{}")
          const state = allBooks.state || {}
          const books = state.issuedBooks || []
          const index = books.findIndex((b: any) => b.id === issuedBook.id)
          if (index !== -1) {
            books[index] = updatedBook
            allBooks.state = { ...state, issuedBooks: books }
            localStorage.setItem("library-store", JSON.stringify(allBooks))
          }
        }
      }
    })
  }, [issuedBooks])

  useEffect(() => {
    // Update fines every minute
    const interval = setInterval(updateFines, 60000)
    updateFines() // Initial update

    return () => clearInterval(interval)
  }, [updateFines])

  return { updateFines }
}
