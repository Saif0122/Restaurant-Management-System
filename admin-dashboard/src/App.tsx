import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center px-4 mx-auto">
            <h1 className="font-bold text-primary">Admin Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 container mx-auto p-4 flex">
          <aside className="w-64 border-r pr-4 min-h-[80vh]">
            <nav className="space-y-2 flex flex-col">
              <span className="font-medium px-2 py-1 bg-secondary/10 rounded-md">Dashboard</span>
              <span className="font-medium px-2 py-1 hover:bg-secondary/10 rounded-md cursor-pointer">Menu Management</span>
              <span className="font-medium px-2 py-1 hover:bg-secondary/10 rounded-md cursor-pointer">Orders</span>
              <span className="font-medium px-2 py-1 hover:bg-secondary/10 rounded-md cursor-pointer">Users</span>
            </nav>
          </aside>
          <div className="flex-1 pl-8">
            <h2 className="text-2xl font-semibold mb-4 text-secondary">Dashboard Overview</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border bg-card text-card-foreground shadow p-6">Revenue</div>
              <div className="rounded-xl border bg-card text-card-foreground shadow p-6">Active Orders</div>
              <div className="rounded-xl border bg-card text-card-foreground shadow p-6">Total Users</div>
            </div>
          </div>
        </main>
      </div>
    ),
  }
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
