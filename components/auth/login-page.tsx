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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-slate-800">
        <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">Library Management</CardTitle>
          <CardDescription className="text-purple-100">Manage your library efficiently</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-200">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                  Login
                </Button>
              </form>

              <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
                <p className="text-xs font-semibold text-purple-300 mb-2">Admin Access:</p>
                <p className="text-xs text-slate-300">Contact your administrator for admin credentials</p>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-200">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
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
