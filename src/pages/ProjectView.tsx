import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  prompt: string;
  created_at: string;
}

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => { if (data) setProject(data); });
  }, [id]);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <Link to="/app" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>
      <h1 className="mb-2 text-xl font-semibold text-foreground">{project.name}</h1>
      <p className="mb-8 text-sm text-muted-foreground">{project.prompt}</p>
      <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
        AI coding workspace coming soon…
      </div>
    </div>
  );
};

export default ProjectView;
