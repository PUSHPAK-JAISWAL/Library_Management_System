"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLibraryStore } from "@/lib/store"

export function LibrarianManagement() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [editingId, setEditingId] = useState(null)

  const { users, addUser, deleteUser, updateUser } = useLibraryStore()

  const librarians = users.filter((u) => u.role === "librarian")

  const handleAddLibrarian = (e) => {
    e.preventDefault()

    if (users.find((u) => u.email === formData.email && u.id !== editingId)) {
      alert("Email already exists")
      return
    }

    if (editingId) {
      updateUser(editingId, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      setEditingId(null)
    } else {
      const newLibrarian = {
        id: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "librarian" as const,
        createdAt: new Date().toISOString(),
      }

      addUser(newLibrarian)
    }

    setFormData({ name: "", email: "", password: "" })
    setShowForm(false)
  }

  const handleEdit = (librarian) => {
    setFormData({
      name: librarian.name,
      email: librarian.email,
      password: librarian.password,
    })
    setEditingId(librarian.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setFormData({ name: "", email: "", password: "" })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Manage Librarians</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Librarian"}</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Librarian" : "Add New Librarian"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddLibrarian} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? "Update" : "Add"} Librarian
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {librarians.map((librarian) => (
          <Card key={librarian.id}>
            <CardHeader>
              <CardTitle>{librarian.name}</CardTitle>
              <CardDescription>{librarian.email}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" onClick={() => handleEdit(librarian)} className="flex-1">
                Edit
              </Button>
              <Button variant="destructive" onClick={() => deleteUser(librarian.id)} className="flex-1">
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {librarians.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No librarians added yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
