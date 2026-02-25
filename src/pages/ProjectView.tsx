import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Cpu, 
  Bot, 
  Zap, 
  Box, 
  ImageIcon, 
  Figma, 
  Paperclip, 
  FileText 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  prompt: string;
  model?: string;
  attachments?: any[];
  created_at: string;
}

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      
      if (!error && data) setProject(data);
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0B0F]">
        <div className="h-4 w-4 animate-pulse rounded-full bg-white/20" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Project not found</h2>
        <Link to="/app" className="text-white/40 hover:text-white transition-colors">Return to Dashboard</Link>
      </div>
    );
  }

  const modelIcons: Record<string, any> = {
    "GPT-4": Sparkles,
    "GPT-4o": Zap,
    "DeepSeek": Cpu,
    "Claude": Bot,
    "Custom": Box
  };
  const ModelIcon = modelIcons[project.model || "GPT-4o"] || Zap;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/10 font-sans relative overflow-x-hidden">
      {/* Background Dotted Grid - Increased visibility & precise centering */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`, 
          backgroundSize: '24px 24px',
          backgroundPosition: 'center'
        }} 
      />

      <nav className="relative z-10 border-b border-white/[0.06] bg-[#0B0B0F]/80 backdrop-blur-xl px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            <Link to="/app" className="p-2 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-white shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-4 w-[1px] bg-white/[0.1] shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm font-bold tracking-tight truncate">{project.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-none">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-full">
              <ModelIcon className="w-3 h-3 text-white/40" />
              <span className="text-[11px] font-bold text-white/60">{project.model || "GPT-4o"}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column: Briefing */}
          <div className="lg:col-span-1 space-y-8 md:space-y-10">
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/20 mb-6">Initial Brief</h2>
              <div className="p-5 md:p-6 bg-[#111115] border border-white/[0.06] rounded-[24px]">
                <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium capitalize">
                  "{project.prompt}"
                </p>
              </div>
            </section>

            {project.attachments && project.attachments.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/20 mb-6">Attachments</h2>
                <div className="space-y-2">
                  {project.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl group hover:bg-white/[0.04] transition-all">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white/60 transition-colors">
                        {file.type === 'figma' && <Figma className="w-4 h-4 text-[#F24E1E]" />}
                        {file.type === 'image' && <ImageIcon className="w-4 h-4 text-blue-400" />}
                        {file.type === 'codebase' && <Paperclip className="w-4 h-4 text-green-400" />}
                        {file.type === 'style' && <FileText className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{file.name}</p>
                        <p className="text-[10px] text-white/20 truncate">{file.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Execution */}
          <div className="lg:col-span-2">
            <div className="aspect-[16/10] min-h-[300px] bg-[#111115] border border-white/[0.06] rounded-[24px] md:rounded-[32px] overflow-hidden relative shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center p-6 md:p-12">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 md:mb-8 relative">
                <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white/20" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Clonex is Building...</h3>
              <p className="max-w-md text-white/40 text-[13px] md:text-sm leading-relaxed mb-8 md:mb-10">
                Our AI agents are analyzing your briefing and initializing the project structure. This workspace will be ready shortly.
              </p>
              
              <div className="w-full max-w-[240px] md:max-w-sm h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  <div className="w-1 h-1 rounded-full bg-green-500" /> Rendering UI
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  <div className="w-1 h-1 rounded-full bg-white/10" /> Deploying Core
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectView;
