import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  password: string
  role: "student" | "librarian" | "admin"
  studentId?: string
  createdAt: string
}

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  imageUrl: string
  totalCopies: number
  availableCopies: number
  location: string
  createdAt: string
}

interface IssuedBook {
  id: string
  bookId: string
  studentId: string
  issuedBy: string
  issuedDate: string
  dueDate: string
  returnedDate?: string
  fine: number
  status: "issued" | "returned" | "overdue"
}

interface BookBooking {
  id: string
  bookId: string
  studentId: string
  bookingDate: string
  pickupDeadline: string
  status: "pending" | "picked" | "cancelled"
}

interface TransactionHistory {
  id: string
  type: "issue" | "return" | "booking" | "fine"
  bookId: string
  studentId: string
  amount?: number
  date: string
  details: string
}

interface LibraryStore {
  users: User[]
  books: Book[]
  issuedBooks: IssuedBook[]
  bookings: BookBooking[]
  notifications: any[]
  transactionHistory: TransactionHistory[]
  addUser: (user: User) => void
  updateUser: (id: string, user: Partial<User>) => void
  deleteUser: (id: string) => void
  addBook: (book: Book) => void
  updateBook: (id: string, book: Partial<Book>) => void
  deleteBook: (id: string) => void
  issueBook: (issuedBook: IssuedBook) => void
  returnBook: (id: string) => void
  reissueBook: (id: string) => void
  createBooking: (booking: BookBooking) => void
  updateBooking: (id: string, booking: Partial<BookBooking>) => void
  addNotification: (notification: any) => void
  removeNotification: (id: string) => void
  addTransaction: (transaction: TransactionHistory) => void
  deleteOldTransactions: (beforeDate: string) => void
  getTransactionsByDateRange: (startDate: string, endDate: string) => TransactionHistory[]
}

const initialUsers: User[] = [
  {
    id: "user_1",
    name: "Admin User",
    email: "admin@lib.com",
    password: "password",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
]

const initialBooks: Book[] = []

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      books: initialBooks,
      issuedBooks: [],
      bookings: [],
      notifications: [],
      transactionHistory: [],

      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),

      updateUser: (id, updatedUser) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      addBook: (book) =>
        set((state) => ({
          books: [...state.books, book],
        })),

      updateBook: (id, updatedBook) =>
        set((state) => ({
          books: state.books.map((b) => (b.id === id ? { ...b, ...updatedBook } : b)),
        })),

      deleteBook: (id) =>
        set((state) => ({
          books: state.books.filter((b) => b.id !== id),
        })),

      issueBook: (issuedBook) =>
        set((state) => {
          const transaction: TransactionHistory = {
            id: `trans_${Date.now()}`,
            type: "issue",
            bookId: issuedBook.bookId,
            studentId: issuedBook.studentId,
            date: new Date().toISOString(),
            details: `Book issued to student`,
          }
          return {
            issuedBooks: [...state.issuedBooks, issuedBook],
            books: state.books.map((b) =>
              b.id === issuedBook.bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b,
            ),
            transactionHistory: [...state.transactionHistory, transaction],
          }
        }),

      returnBook: (id) =>
        set((state) => {
          const issuedBook = state.issuedBooks.find((ib) => ib.id === id)
          const transaction: TransactionHistory = {
            id: `trans_${Date.now()}`,
            type: "return",
            bookId: issuedBook?.bookId || "",
            studentId: issuedBook?.studentId || "",
            amount: issuedBook?.fine,
            date: new Date().toISOString(),
            details: `Book returned${issuedBook?.fine ? ` with fine: ₹${issuedBook.fine}` : ""}`,
          }
          return {
            issuedBooks: state.issuedBooks.map((ib) =>
              ib.id === id ? { ...ib, status: "returned", returnedDate: new Date().toISOString() } : ib,
            ),
            books: state.books.map((b) =>
              b.id === issuedBook?.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b,
            ),
            transactionHistory: [...state.transactionHistory, transaction],
          }
        }),

      reissueBook: (id) =>
        set((state) => {
          const issuedBook = state.issuedBooks.find((ib) => ib.id === id)
          if (!issuedBook) return state

          const newDueDate = new Date()
          newDueDate.setDate(newDueDate.getDate() + 7)

          return {
            issuedBooks: state.issuedBooks.map((ib) =>
              ib.id === id
                ? {
                    ...ib,
                    dueDate: newDueDate.toISOString(),
                    fine: 0,
                  }
                : ib,
            ),
          }
        }),

      createBooking: (booking) =>
        set((state) => ({
          bookings: [...state.bookings, booking],
        })),

      updateBooking: (id, updatedBooking) =>
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updatedBooking } : b)),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      addTransaction: (transaction) =>
        set((state) => ({
          transactionHistory: [...state.transactionHistory, transaction],
        })),

      deleteOldTransactions: (beforeDate) =>
        set((state) => ({
          transactionHistory: state.transactionHistory.filter((t) => new Date(t.date) >= new Date(beforeDate)),
        })),

      getTransactionsByDateRange: (startDate, endDate) => {
        const state = get()
        return state.transactionHistory.filter((t) => {
          const tDate = new Date(t.date)
          return tDate >= new Date(startDate) && tDate <= new Date(endDate)
        })
      },
    }),
    {
      name: "library-store",
    },
  ),
)
