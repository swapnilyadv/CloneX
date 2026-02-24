import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Github,
  Settings,
  LogOut,
  Code2,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FolderKanban, label: "Projects", path: "/dashboard/projects" },
  { icon: Github, label: "GitHub", path: "/dashboard/github" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const Dashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <Link to="/" className="text-lg font-bold text-sidebar-primary">
            Clonex
          </Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <header className="flex h-16 items-center border-b border-border px-6">
          <button className="mr-4 md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-sm font-medium text-foreground">Dashboard</h1>
        </header>

        <div className="p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-2 text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="mb-8 text-muted-foreground">
              Ready to build something amazing?
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Start Coding Card */}
              <div className="surface-card flex flex-col items-start p-8">
                <Code2 className="mb-4 h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                <h3 className="mb-2 text-lg font-semibold text-foreground">Start Coding</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  Open the editor and start building with AI assistance.
                </p>
                <button className="rounded-lg bg-foreground px-5 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90">
                  Open Editor
                </button>
              </div>

              {/* GitHub Status */}
              <div className="surface-card flex flex-col items-start p-8">
                <Github className="mb-4 h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                <h3 className="mb-2 text-lg font-semibold text-foreground">GitHub</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  Connect your GitHub account to access your repositories.
                </p>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Not connected</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="surface-card flex flex-col items-start p-8">
                <FolderKanban className="mb-4 h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                <h3 className="mb-2 text-lg font-semibold text-foreground">Projects</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  You have no projects yet. Create your first one.
                </p>
                <button className="rounded-lg border border-border bg-secondary px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover">
                  New Project
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
