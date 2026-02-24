import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Star,
  Users,
  Settings,
  LogOut,
  Plus,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  prompt: string;
  starred: boolean;
  created_at: string;
}

const AppDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "starred" | "shared">("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setProjects(data);
  };

  const handleCreateProject = async () => {
    if (!prompt.trim() || !user) return;
    setLoading(true);

    const name = prompt.length > 40 ? prompt.substring(0, 40) + "…" : prompt;

    const { data, error } = await supabase
      .from("projects")
      .insert({ user_id: user.id, name, prompt })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setPrompt("");
    if (data) {
      navigate(`/app/project/${data.id}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const filteredProjects = activeTab === "starred"
    ? projects.filter((p) => p.starred)
    : projects;

  const navItems = [
    { icon: FolderKanban, label: "All Projects", tab: "all" as const },
    { icon: Star, label: "Starred", tab: "starred" as const },
    { icon: Users, label: "Shared with me", tab: "shared" as const },
    { icon: Settings, label: "Settings", tab: null },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-5">
          <Link to="/" className="text-base font-bold text-foreground">Clonex</Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => item.tab && setActiveTab(item.tab)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                item.tab === activeTab
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <header className="flex h-14 items-center border-b border-border px-5 md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </button>
        </header>

        <div className="mx-auto max-w-2xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="mb-10 text-3xl font-semibold text-foreground">
              Let's build something.
            </h1>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the app you want to build…"
                rows={4}
                className="w-full resize-none rounded-xl border border-border bg-card px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                onClick={handleCreateProject}
                disabled={!prompt.trim() || loading}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {loading ? "Creating…" : "Start"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Projects list */}
          {filteredProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-16"
            >
              <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recent Projects
              </h2>
              <div className="space-y-2">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/app/project/${project.id}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{project.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppDashboard;
