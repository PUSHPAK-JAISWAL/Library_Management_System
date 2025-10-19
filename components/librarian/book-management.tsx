"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLibraryStore } from "@/lib/store"

export function BookManagement() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    imageUrl: "",
    totalCopies: 1,
    location: "",
  })

  const { books, addBook, updateBook, deleteBook } = useLibraryStore()

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm),
  )

  const handleAddBook = (e) => {
    e.preventDefault()
    const newBook = {
      id: `book_${Date.now()}`,
      ...formData,
      totalCopies: Number.parseInt(formData.totalCopies),
      availableCopies: Number.parseInt(formData.totalCopies),
      createdAt: new Date().toISOString(),
    }
    addBook(newBook)
    setFormData({
      title: "",
      author: "",
      isbn: "",
      imageUrl: "",
      totalCopies: 1,
      location: "",
    })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Manage Books</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add New Book"}</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Author</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">ISBN</label>
                  <Input
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Total Copies</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.totalCopies}
                    onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Image URL</label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Book
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div>
        <Input
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4">
        {filteredBooks.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">ISBN</p>
                  <p className="font-semibold">{book.isbn}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-semibold">{book.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Available</p>
                  <p className="font-semibold">
                    {book.availableCopies} / {book.totalCopies}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => deleteBook(book.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
