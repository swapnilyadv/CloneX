import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  prompt: string;
  created_at: string;
  status?: string;
}

const ProjectView = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [project,setProject] = useState<Project | null>(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    if(!id) return;

    const fetchProject = async ()=>{

      const { data,error } = await supabase
      .from("projects")
      .select("*")
      .eq("id",id)
      .single()

      if(data){

        setProject(data)

        if(data.status === "ready"){
          navigate(`/app/workspace/${id}`)
        }

      }

      setLoading(false)

    }

    fetchProject()

    const channel = supabase
    .channel("project-status")
    .on(
      "postgres_changes",
      {
        event:"UPDATE",
        schema:"public",
        table:"projects",
        filter:`id=eq.${id}`
      },
      (payload:any)=>{

        if(payload.new.status === "ready"){
          navigate(`/app/workspace/${id}`)
        }

      }
    )
    .subscribe()

    return ()=>{
      supabase.removeChannel(channel)
    }

  },[id,navigate])


  if(loading){
    return(
      <div className="flex min-h-screen items-center justify-center bg-[#0B0B0F]">
        <div className="h-4 w-4 animate-pulse rounded-full bg-white/20"/>
      </div>
    )
  }

  if(!project){
    return(
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-white">
        <h2 className="text-xl font-bold mb-2">Project not found</h2>
        <Link to="/app" className="text-white/40 hover:text-white">Back</Link>
      </div>
    )
  }

  return(

    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="text-center max-w-lg">

        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 mx-auto relative">

          <div className="absolute inset-0 border-2 border-white/10 border-t-white/40 rounded-full animate-spin"/>

          <Sparkles className="w-8 h-8 text-white/30"/>

        </div>

        <h2 className="text-2xl font-bold mb-4">
          Clonex is Building...
        </h2>

        <p className="text-white/40 mb-8">
          Our AI agents are generating your project files and preparing the workspace.
        </p>

        <div className="w-full h-1 bg-white/10 rounded overflow-hidden">

          <motion.div
          initial={{width:"0%"}}
          animate={{width:"80%"}}
          transition={{duration:4,repeat:Infinity,repeatType:"reverse"}}
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          />

        </div>

      </div>

    </div>

  )

}

export default ProjectView;