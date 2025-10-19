"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLibraryStore } from "@/lib/store"

export function LoginPage({ setCurrentUser }) {
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const { users, addUser } = useLibraryStore()

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")

    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      setCurrentUser(user)
    } else {
      setError("Invalid email or password")
    }
  }

  const handleSignup = (e) => {
    e.preventDefault()
    setError("")

    if (users.find((u) => u.email === email)) {
      setError("Email already exists")
      return
    }

    const studentId = `STU${Date.now().toString().slice(-6)}`
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      role: "student",
      studentId,
      createdAt: new Date().toISOString(),
    }

    addUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    setCurrentUser(newUser)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
          <CardTitle className="text-3xl">Library Management</CardTitle>
          <CardDescription className="text-blue-100">Manage your library efficiently</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  Login
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-2">Admin Access:</p>
                <p className="text-xs text-blue-700">Contact your administrator for admin credentials</p>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
