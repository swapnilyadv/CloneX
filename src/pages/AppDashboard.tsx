import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FolderKanban,
  Star,
  Users,
  Settings,
  LogOut,
  Plus,
  ArrowRight,
  Clock,
  LayoutGrid,
  ChevronRight,
  Search,
  User,
  Check,
  Zap,
  Sparkles,
  Cpu,
  Bot,
  Box,
  Upload,
  Flag,
  Figma,
  FileCode,
  X,
  Paperclip,
  ImageIcon,
  FileText,
  Menu,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  prompt: string;
  model?: string;
  attachments?: any[];
  starred: boolean;
  created_at: string;
}

interface Attachment {
  id: string;
  type: "figma" | "codebase" | "image" | "style";
  value: string;
  name: string;
  preview?: string;
}

const AppDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"recent" | "templates">("recent");
  const [activeNav, setActiveNav] = useState<"home" | "projects" | "settings">("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // New State for Creation Panel
  const [creationTab, setCreationTab] = useState<"build" | "design" | "components">("build");
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showPlusDropdown, setShowPlusDropdown] = useState(false);
  const [modalType, setModalType] = useState<null | "settings" | "projects" | "profile" | "upgrade" | "figma" | "styleguide">(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState<"general" | "account" | "billing">("general");
  
  // Attachments State
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [figmaUrl, setFigmaUrl] = useState("");
  const [styleGuideText, setStyleGuideText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const models = [
    { name: "GPT-4", icon: Sparkles },
    { name: "GPT-4o", icon: Zap },
    { name: "DeepSeek", icon: Cpu },
    { name: "Claude", icon: Bot },
    { name: "Custom", icon: Box },
  ];

  const handleCreateProject = async () => {
    if (!prompt.trim() || !user) return;
    setLoading(true);

    const name = prompt.length > 40 ? prompt.substring(0, 40) + "…" : prompt;

    const { data, error } = await supabase
      .from("projects")
      .insert({ 
        user_id: user.id, 
        name, 
        prompt,
        model: selectedModel,
        attachments: attachments.map(a => ({ type: a.type, value: a.value, name: a.name }))
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setPrompt("");
    setAttachments([]);
    if (data) {
      navigate(`/app/project/${data.id}`);
    }
  };

  const addAttachment = (attachment: Omit<Attachment, "id">) => {
    const newAttachment = { ...attachment, id: Math.random().toString(36).substring(7) };
    setAttachments(prev => [...prev, newAttachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addAttachment({
        type: "codebase",
        value: file.name, // In a real app, you'd upload this to storage
        name: file.name
      });
      toast({ title: "File added", description: file.name });
    }
    e.target.value = "";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (prev) => {
        addAttachment({
          type: "image",
          value: prev.target?.result as string,
          name: file.name,
          preview: prev.target?.result as string
        });
      };
      reader.readAsDataURL(file);
      toast({ title: "Image added", description: file.name });
    }
    e.target.value = "";
  };

  const handleFigmaSubmit = () => {
    if (figmaUrl.trim()) {
      addAttachment({
        type: "figma",
        value: figmaUrl,
        name: "Figma Design"
      });
      setFigmaUrl("");
      setModalType(null);
      toast({ title: "Figma design imported" });
    }
  };

  const handleStyleGuideSubmit = () => {
    if (styleGuideText.trim()) {
      addAttachment({
        type: "style",
        value: styleGuideText,
        name: "Style Guide"
      });
      setStyleGuideText("");
      setModalType(null);
      toast({ title: "Style guide added" });
    }
  };

  const plusOptions = [
    { label: "Add Image", icon: ImageIcon, action: () => imageInputRef.current?.click() },
    { label: "Upload Codebase", icon: Upload, action: () => fileInputRef.current?.click() },
    { label: "Import Figma design", icon: Figma, action: () => setModalType("figma") },
    { label: "Custom Style Guide", icon: FileText, action: () => setModalType("styleguide") },
  ];

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setProjects(data);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const openCreationFlow = () => {
    handleCreateProject();
  };

  const PricingCard = ({ title, price, features, highlighted = false }: { title: string, price: string, features: string[], highlighted?: boolean }) => (
    <div className={`flex flex-col p-6 rounded-2xl border transition-all duration-300 ${highlighted ? "bg-[#16161C] border-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] scale-105 z-10" : "bg-[#111115] border-white/[0.06]"}`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Free" && <span className="text-white/40 text-sm">/month</span>}
      </div>
      <ul className="space-y-3 flex-1 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-white/60">
            <Check className="w-4 h-4 text-white/40" />
            {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${highlighted ? "bg-white text-black hover:opacity-90" : "bg-white/5 text-white hover:bg-white/10 border border-white/10"}`}>
        {title === "Starter" ? "Current Plan" : "Upgrade"}
      </button>
    </div>
  );

  const renderModal = () => {
    if (!modalType) return null;

    if (modalType === "upgrade") {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalType(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-[#0B0B0F] border border-white/[0.08] rounded-[32px] p-12 shadow-2xl overflow-hidden"
          >
            <button
              onClick={() => setModalType(null)}
              className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-2xl transition-all"
            >
              <X className="w-5 h-5 text-white/20" />
            </button>
            
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-3">Upgrade to Clonex</h2>
              <p className="text-white/40">Unlock more powerful AI models and collaboration tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <PricingCard
                title="Starter"
                price="Free"
                features={["5 Projects", "Basic AI Chat", "Community Access"]}
              />
              <PricingCard
                title="Clonex Pro"
                price="$20"
                highlighted
                features={["Unlimited Projects", "GPT-4o & Claude 3.5", "Advanced Styling", "Early AI Features"]}
              />
              <PricingCard
                title="Clonex Teams"
                price="$100"
                features={["Shared Workspaces", "Team Analytics", "Priority Support", "SSO & Security"]}
              />
            </div>
          </motion.div>
        </div>
      );
    }

    if (modalType === "figma") {
      return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalType(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#16161C] border border-white/[0.08] rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#F24E1E]/10 flex items-center justify-center">
                <Figma className="w-5 h-5 text-[#F24E1E]" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Import Figma</h3>
                <p className="text-xs text-white/40">Paste your Figma file URL below</p>
              </div>
            </div>
            <input
              autoFocus
              type="url"
              placeholder="https://figma.com/file/..."
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFigmaSubmit();
                }
              }}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setModalType(null)}
                className="px-4 py-2 text-sm font-medium text-white/40 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleFigmaSubmit}
                className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:opacity-90"
              >
                Import
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (modalType === "styleguide") {
      return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalType(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#16161C] border border-white/[0.08] rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Style Guide</h3>
                <p className="text-xs text-white/40">Define brand colors, fonts, and rules</p>
              </div>
            </div>
            <textarea
              autoFocus
              placeholder="Primary colors: #000, #fff... 
Brand voice: Professional and minimalist..."
              value={styleGuideText}
              onChange={(e) => setStyleGuideText(e.target.value)}
              className="w-full h-40 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 mb-4 resize-none"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setModalType(null)}
                className="px-4 py-2 text-sm font-medium text-white/40 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleStyleGuideSubmit}
                className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:opacity-90"
              >
                Save Style Guide
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setModalType(null)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        <motion.div
          layoutId="modal"
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative w-full max-w-4xl h-[600px] bg-[#0B0B0F] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden flex"
        >
          {/* Settings Sidebar */}
          <div className="w-64 border-r border-white/[0.06] bg-white/[0.01] p-6 flex flex-col">
            <h2 className="text-lg font-bold mb-8 px-2">Workspace</h2>
            <nav className="space-y-1">
              {[
                { id: "general", label: "General", icon: Settings },
                { id: "account", label: "Account", icon: User },
                { id: "billing", label: "Billing", icon: Zap },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSettingsTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSettingsTab === tab.id
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
            <button
              onClick={() => setModalType(null)}
              className="mt-auto flex items-center gap-3 px-3 py-2 text-sm text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
            {activeSettingsTab === "general" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-xl font-bold mb-6">General Settings</h3>
                  <div className="space-y-6">
                    <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Auto-save changes</p>
                        <p className="text-xs text-white/40 mt-1">Saves your work automatically as you type.</p>
                      </div>
                      <div className="w-10 h-5 bg-white/20 rounded-full cursor-pointer relative"><div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full translate-x-0" /></div>
                    </div>
                    <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Developer Mode</p>
                        <p className="text-xs text-white/40 mt-1">Enables advanced debugging and inspection tools.</p>
                      </div>
                      <div className="w-10 h-5 bg-white/5 rounded-full cursor-pointer relative"><div className="absolute top-1 left-1 w-3 h-3 bg-white/30 rounded-full" /></div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/[0.06] flex justify-end gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-white/40 hover:text-white transition-colors">Reset</button>
                  <button onClick={() => { toast({ title: "Settings Saved" }); setModalType(null); }} className="px-5 py-2 bg-white text-black text-sm font-bold rounded-lg hover:opacity-90">Save Changes</button>
                </div>
              </div>
            )}
            {activeSettingsTab === "account" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 text-center py-10">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-2xl font-bold mb-4">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{user?.user_metadata?.username || "Clonex User"}</h3>
                  <p className="text-white/40 text-sm">{user?.email}</p>
                </div>
                <div className="max-w-xs mx-auto space-y-3">
                  <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm transition-all focus:outline-none focus:ring-1 focus:ring-white/20">Change Password</button>
                  <button className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 text-red-400 rounded-xl text-sm transition-all">Delete Account</button>
                </div>
              </div>
            )}
            {activeSettingsTab === "billing" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-xl font-bold">Billing & Usage</h3>
                <div className="p-6 bg-[#16161C] border border-white/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white mb-1">Starter Plan</h4>
                    <p className="text-xs text-white/40">You are currently on the free version of Clonex.</p>
                  </div>
                  <button onClick={() => setModalType("upgrade")} className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg leading-none">Upgrade</button>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Recent Invoices</p>
                  <p className="text-sm text-center py-10 text-white/20 bg-white/[0.02] border border-dashed border-white/10 rounded-xl">No invoices found</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-white/10 relative overflow-x-hidden">
      {/* Background Dotted Grid - Increased visibility & centered feel */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`, 
          backgroundSize: '24px 24px',
          backgroundPosition: 'center'
        }} 
      />
      
      <AnimatePresence>
        {renderModal()}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <aside className={`w-64 border-r border-white/[0.06] bg-[#0B0B0F] flex flex-col fixed inset-y-0 left-0 z-[60] transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/app" className="text-2xl font-bold tracking-tight text-white focus:outline-none">
            Clonex
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: "home", icon: Home, label: "Home", action: () => { setActiveNav("home"); setIsSidebarOpen(false); } },
            { id: "projects", icon: FolderKanban, label: "All Projects", action: () => { setModalType("projects"); setIsSidebarOpen(false); } },
            { id: "settings", icon: Settings, label: "Settings", action: () => { setModalType("settings"); setIsSidebarOpen(false); } },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => item.action()}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeNav === item.id || (item.id === "settings" && modalType === "settings")
                  ? "bg-white/[0.06] text-white"
                  : "text-white/40 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <item.icon className="w-4 h-4" strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mb-6 mt-auto flex flex-col gap-4">
          <button
            onClick={() => { setModalType("upgrade"); setIsSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/[0.08] transition-all text-white/70 hover:text-white"
          >
            <Zap className="w-4 h-4" />
            Upgrade to Clonex
          </button>
          
          <button
            onClick={() => { handleLogout(); setIsSidebarOpen(false); }}
            className="w-full py-2 text-xs font-medium text-white/20 hover:text-red-400/60 transition-colors text-center"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0B0B0F]/80 backdrop-blur-md sticky top-0 z-40">
          <Link to="/app" className="text-xl font-bold tracking-tight text-white">
            Clonex
          </Link>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-white/60 hover:text-white bg-white/5 rounded-lg border border-white/10">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="max-w-6xl w-full mx-auto px-4 md:px-8 lg:px-12 pt-12 md:pt-32 pb-24 flex flex-col justify-center min-h-[calc(100vh-64px)] md:min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Centered Creation Card */}
            <div className="flex flex-col items-center mb-16 md:mb-24">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-8 md:mb-12 text-center px-4">
                Create something amazing
              </h1>
              
              <div className="w-full max-w-full md:max-w-3xl bg-[#111115] border border-white/[0.08] rounded-[22px] md:rounded-[24px] overflow-hidden shadow-2xl shadow-black/40 transition-all duration-300">
                {/* Tabs */}
                <div className="flex items-center px-3 md:px-4 pt-4 gap-1 md:gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setCreationTab("build")}
                    className={`whitespace-nowrap px-3 md:px-4 py-2 rounded-lg text-[13px] md:text-sm font-medium transition-all ${
                      creationTab === "build"
                        ? "bg-white/[0.06] text-white"
                        : "text-white/30 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    Build from scratch
                  </button>
                  <button
                    onClick={() => setCreationTab("components")}
                    className={`whitespace-nowrap px-3 md:px-4 py-2 rounded-lg text-[13px] md:text-sm font-medium transition-all ${
                      creationTab === "components"
                        ? "bg-white/[0.06] text-white"
                        : "text-white/30 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    Components
                  </button>
                </div>

                {/* Main Input Area */}
                <div className="px-5 py-2">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={creationTab === "build" ? "Describe the app you want to build..." : "Describe the design you want to create..."}
                    className="w-full bg-transparent px-2 py-4 text-xl text-white placeholder:text-white/20 focus:outline-none resize-none min-h-[160px] leading-relaxed"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        openCreationFlow();
                      }
                    }}
                  />
                </div>

                {/* Attachment Chips - Scrollable Row */}
                {attachments.length > 0 && (
                  <div className="px-5 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
                    <AnimatePresence mode="popLayout">
                      {attachments.map((file) => (
                        <motion.div
                          key={file.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg group hover:border-white/20 transition-all text-[11px]"
                        >
                          {file.type === 'figma' && <Figma className="w-2.5 h-2.5 text-[#F24E1E]" />}
                          {file.type === 'image' && <ImageIcon className="w-2.5 h-2.5 text-blue-400" />}
                          {file.type === 'codebase' && <Paperclip className="w-2.5 h-2.5 text-green-400" />}
                          {file.type === 'style' && <FileText className="w-2.5 h-2.5 text-purple-400" />}
                          <span className="font-medium text-white/50 group-hover:text-white/80 max-w-[100px] truncate">
                            {file.name}
                          </span>
                          <button 
                            onClick={() => removeAttachment(file.id)}
                            className="p-0.5 hover:bg-white/10 rounded-full text-white/20 hover:text-red-400 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Bottom Row Controls */}
                <div className="flex items-center justify-between px-5 py-4 bg-white/[0.01] border-t border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    {/* AI Model Selector */}
                    <div className="relative">
                      <button
                        onClick={() => setShowModelDropdown(!showModelDropdown)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all ${showModelDropdown ? "ring-2 ring-white/10 bg-white/10" : ""}`}
                      >
                        {models.find(m => m.name === selectedModel)?.icon && (
                          <span className="text-white/40">
                            {(() => {
                              const ModelIcon = models.find(m => m.name === selectedModel)?.icon!;
                              return <ModelIcon className="w-3 h-3" />;
                            })()}
                          </span>
                        )}
                        {selectedModel}
                      </button>

                      {showModelDropdown && (
                        <>
                          <div className="fixed inset-0 z-[60]" onClick={() => setShowModelDropdown(false)} />
                          <div className="absolute left-0 bottom-full mb-2 w-48 bg-[#1B1B1F] border border-white/[0.08] rounded-xl shadow-2xl py-2 z-[70] overflow-hidden">
                            {models.map((m) => (
                              <button
                                key={m.name}
                                onClick={() => {
                                  setSelectedModel(m.name);
                                  setShowModelDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors text-left font-medium"
                              >
                                <m.icon className="w-3.5 h-3.5" />
                                {m.name}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Plus Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowPlusDropdown(!showPlusDropdown)}
                        className={`p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all ${showPlusDropdown ? "ring-2 ring-white/10 bg-white/10" : ""}`}
                      >
                        <Plus className="w-4 h-4 text-white/40" />
                      </button>

                      {showPlusDropdown && (
                        <>
                          <div className="fixed inset-0 z-[60]" onClick={() => setShowPlusDropdown(false)} />
                          <div className="absolute left-0 bottom-full mb-2 w-56 bg-[#1B1F24] border border-white/[0.08] rounded-xl shadow-2xl py-2 z-[70] overflow-hidden">
                            {plusOptions.map((opt) => (
                              <button
                                key={opt.label}
                                onClick={() => {
                                  opt.action();
                                  setShowPlusDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors text-left font-medium"
                              >
                                <opt.icon className="w-3.5 h-3.5" />
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={openCreationFlow}
                    disabled={loading || !prompt.trim()}
                    className="flex items-center gap-2 bg-[#E2E2E2] hover:bg-white text-[#0B0B0F] px-6 py-2.5 rounded-xl text-sm font-black tracking-wide transition-all shadow-lg shadow-[#ffffff]/5 active:scale-95 disabled:opacity-10 disabled:cursor-not-allowed group/btn"
                  >
                    {loading ? "Starting..." : "Start →"}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section - Projects & Templates */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-8 border-b border-white/[0.06]">
                  {[
                    { id: "recent", label: "Recent Projects", icon: Clock },
                    { id: "templates", label: "Templates", icon: LayoutGrid },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 pb-4 text-sm font-medium transition-all relative ${
                        activeTab === tab.id ? "text-white" : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-white"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <Link
                  to="/app/projects"
                  className="text-sm font-semibold text-white/60 hover:text-white transition-colors"
                >
                  View all projects
                </Link>
              </div>

              {/* Grid */}
              {activeTab === "recent" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/app/project/${project.id}`}
                        className="group bg-[#111115] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300"
                      >
                        <div className="aspect-[16/10] bg-[#0B0F0F] border-b border-white/[0.02] flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br from-white/20 to-transparent" />
                          <FolderKanban className="w-10 h-10 text-white/5 group-hover:text-white/10 transition-all duration-500 scale-100 group-hover:scale-110" />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <h3 className="text-sm font-medium truncate text-white group-hover:text-white transition-colors">
                              {project.name}
                            </h3>
                            {project.starred && <Star className="w-3.5 h-3.5 text-yellow-500/80 fill-yellow-500/20" />}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-white/30 uppercase tracking-wider font-semibold">
                            <span>{new Date(project.created_at).toLocaleDateString()}</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full py-20 bg-[#111115] rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                      <FolderKanban className="w-12 h-12 text-white/10 mb-4" />
                      <p className="text-white/40 text-sm">No projects found. Start building to see them here.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    "SaaS Landing Page",
                    "AI Tool Dashboard",
                    "E-commerce Storefront",
                    "Blog Engine",
                    "Portfolio Workspace",
                    "Social Feed UI",
                  ].map((tpl) => (
                    <div
                      key={tpl}
                      className="cursor-pointer group bg-[#111115] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300"
                    >
                      <div className="aspect-[16/10] bg-[#0B0F0F] border-b border-white/[0.02] flex items-center justify-center">
                        <Plus className="w-8 h-8 text-white/5 group-hover:text-white/20 transition-all duration-500 group-hover:rotate-90" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-sm font-medium text-white mb-1">{tpl}</h3>
                        <p className="text-[11px] text-white/30 uppercase tracking-wider font-semibold group-hover:text-white/50 transition-colors">Use Template</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".txt,.js,.ts,.tsx,.json,.md"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default AppDashboard;
