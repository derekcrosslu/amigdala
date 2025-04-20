"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Settings,
  Menu,
  X 
} from "lucide-react";

// This is a placeholder for authentication. In a real implementation, 
// we would add proper session handling and redirect logic.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // This is just a mock authentication for demonstration
  // In a real app, you would check the session/token
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const authenticated = localStorage.getItem('adminAuthenticated');
      setIsAuthenticated(authenticated === 'true');
    };
    
    checkAuth();
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <LoginForm onSuccess={() => {
          localStorage.setItem('adminAuthenticated', 'true');
          setIsAuthenticated(true);
        }} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`bg-yellow-200 text-black w-64 flex-shrink-0 fixed md:sticky top-0 h-screen overflow-y-auto transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6">
          <Link href="/admin" className="flex items-center space-x-2 mb-8">
            <span className="text-2xl font-bold">AMIGDALA Admin</span>
          </Link>
          
          <nav className="space-y-1">
            <NavLink href="/admin" icon={<LayoutDashboard />} text="Dashboard" />
            <NavLink href="/admin/content" icon={<FileText />} text="Content" />
            <NavLink href="/admin/media" icon={<ImageIcon />} text="Media" />
            <NavLink href="/admin/settings" icon={<Settings />} text="Settings" />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-yellow-300">
          <button 
            className="flex items-center space-x-2 text-sm font-medium hover:text-yellow-800 transition"
            onClick={() => {
              localStorage.removeItem('adminAuthenticated');
              setIsAuthenticated(false);
            }}
          >
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center space-x-2 p-2 rounded-md hover:bg-yellow-300 transition-colors"
    >
      <span className="text-black">{icon}</span>
      <span className="font-medium">{text}</span>
    </Link>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-black w-full transition-colors"
            type="submit"
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}
