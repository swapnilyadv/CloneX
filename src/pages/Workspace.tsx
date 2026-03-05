
import React, { useState, useEffect, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Editor from "@monaco-editor/react"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"

import {
ArrowLeft,
FileCode,
Search,
Globe,
Bot,
Send,
Paperclip
} from "lucide-react"

interface FileObject {
name:string
content:string
}

const Workspace = () => {

const navigate = useNavigate()

const [files,setFiles] = useState<FileObject[]>([])
const [activeFile,setActiveFile] = useState<FileObject | null>(null)

const [message,setMessage] = useState("")
const [model,setModel] = useState("gpt-4o")
const [mode,setMode] = useState("ask")
const [loading,setLoading] = useState(false)

const terminalRef = useRef<HTMLDivElement>(null)
const termInstance = useRef<Terminal | null>(null)
const socketRef = useRef<WebSocket | null>(null)
const iframeRef = useRef<HTMLIFrameElement>(null)

// default files
useEffect(()=>{

const baseFiles = [

{
name:"index.html",
content:`<!DOCTYPE html>
<html>

<head>
<title>Clonex</title>
<link rel="stylesheet" href="style.css">
</head>

<body>

<h1>Hello Swapnil 🚀</h1>

<button onclick="hello()">Click me</button>

<script src="script.js"></script>

</body>

</html>`
},

{
name:"style.css",
content:`body{
background:#111;
color:white;
font-family:Arial;
text-align:center;
padding:40px;
}`
},

{
name:"script.js",
content:`function hello(){
alert("Clonex Works 🚀")
}`
}

]

setFiles(baseFiles)
setActiveFile(baseFiles[0])

},[])


// real terminal connection
useEffect(()=>{

if(!terminalRef.current) return

const term = new Terminal({
cursorBlink:true,
fontSize:12,
theme:{
background:"#0B0B0F"
}
})

const fit = new FitAddon()

term.loadAddon(fit)
term.open(terminalRef.current)
fit.fit()

const socket = new WebSocket("ws://localhost:5000/api/terminal")
socketRef.current = socket

socket.onopen = () => {
  term.write("\x1b[32mConnected to terminal server.\x1b[0m\r\n")
  // Initial resize
  const { cols, rows } = fit.proposeDimensions() || { cols: 80, rows: 24 }
  socket.send(JSON.stringify({ type: "resize", cols, rows }))
}

socket.onmessage = (event)=>{
  try {
    const msg = JSON.parse(event.data)
    if (msg.type === "output") {
      term.write(msg.data)
    }
  } catch (e) {
    term.write(event.data)
  }
}

socket.onerror = () => {
  term.write("\r\n\x1b[31mTerminal connection error. Ensure backend is running.\x1b[0m\r\n")
}

socket.onclose = () => {
  term.write("\r\n\x1b[31mdDisconnected from terminal server.\x1b[0m\r\n")
}

term.onData((data)=>{
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "input", data }))
  }
})

termInstance.current = term

const handleResize = () => {
  fit.fit()
  const dims = fit.proposeDimensions()
  if (dims && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "resize", cols: dims.cols, rows: dims.rows }))
  }
}

window.addEventListener("resize", handleResize)

return () => {
  window.removeEventListener("resize", handleResize)
  socket.close()
  term.dispose()
}

},[])


// editor change
const onChange = (value:any)=>{

if(!activeFile) return

const updated = files.map(f=>{

if(f.name === activeFile.name){

return {...f,content:value}

}

return f

})

setFiles(updated)

}


// language
const lang = (name:string)=>{

const ext = name.split(".").pop()

if(ext==="html") return "html"
if(ext==="css") return "css"
if(ext==="js") return "javascript"

return "text"

}


// preview
// realtime preview
useEffect(()=>{

const html = files.find(f=>f.name==="index.html")
const css = files.find(f=>f.name==="style.css")
const js = files.find(f=>f.name==="script.js")

if(!html || !iframeRef.current) return

let content = html.content

if(css){
content = content.replace("</head>",`<style>${css.content}</style></head>`)
}

if(js){
content = content.replace("</body>",`<script>${js.content}</script></body>`)
}

iframeRef.current.srcdoc = content

},[files])


// AI send
const sendAI = async ()=>{

if(!message || loading) return

setLoading(true)

try {
  const res = await fetch("http://localhost:5000/api/ai-edit",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({message, files, model, mode})
  })

  if (!res.ok) throw new Error("AI edit failed")
  const data = await res.json()

  if(mode==="agent" && data.files){
    setFiles(data.files)
    if(data.files.length){
      setActiveFile(data.files[0])
    }
  }

  if(mode==="ask"){
    alert(data.answer || "AI response")
  }
} catch (err: any) {
  console.error("AI edit error", err)
  alert("AI Agent encountered an error: " + err.message)
} finally {
  setLoading(false)
  setMessage("")
}

}


// upload file
const uploadFile = (e:any)=>{

const file = e.target.files[0]

if(!file) return

const reader = new FileReader()

reader.onload = ()=>{

const newFile = {

name:file.name,
content:reader.result as string

}

setFiles([...files,newFile])

}

reader.readAsText(file)

}


return(

<div className="flex flex-col h-screen bg-[#0B0B0F] text-white">

<header className="h-10 flex items-center px-4 border-b border-white/10 gap-3">

<button onClick={()=>navigate("/app")}>
<ArrowLeft size={16}/>
</button>

<span className="font-bold text-sm">
Clonex Workspace
</span>

</header>


<div className="flex flex-1 overflow-hidden">


{/* Explorer */}

<div className="w-56 border-r border-white/10 flex flex-col">

<div className="p-2 flex justify-between border-b border-white/10">

<span className="text-xs text-white/50">
EXPLORER
</span>

<Search size={14}/>

</div>

<div className="flex-1 overflow-y-auto">

{files.map(file=>(
<button

key={file.name}

onClick={()=>setActiveFile(file)}

className={`flex items-center gap-2 px-3 py-2 text-xs w-full

${activeFile?.name===file.name
?"bg-white/10"
:"hover:bg-white/5"}`}

>

<FileCode size={14}/>

{file.name}

</button>
))}

</div>

</div>



{/* Editor + Terminal */}

<div className="flex-1 flex flex-col">

<div className="flex-1">

{activeFile && (

<Editor
theme="vs-dark"
height="100%"
language={lang(activeFile.name)}
value={activeFile.content}
onChange={onChange}
/>

)}

</div>

<div
ref={terminalRef}
style={{height:"180px"}}
/>

</div>



{/* Preview + AI */}

<div className="w-[420px] border-l border-white/10 flex flex-col">


{/* preview */}

<div className="flex-1">

<div className="h-8 flex items-center px-3 border-b border-white/10 text-xs">

<Globe size={14} className="mr-2"/>

Preview

</div>

<iframe
ref={iframeRef}
className="w-full h-full bg-white"
sandbox="allow-scripts"
/>

</div>



{/* AI */}

<div className="h-56 border-t border-white/10 flex flex-col">


<div className="flex items-center gap-2 p-2">

<Bot size={14}/>

<select
value={mode}
onChange={(e)=>setMode(e.target.value)}
className="bg-black text-xs px-2 py-1 border rounded"
>

<option value="ask">Ask</option>
<option value="agent">Agent</option>

</select>

<select
value={model}
onChange={(e)=>setModel(e.target.value)}
className="bg-black text-xs px-2 py-1 border rounded"
>

<option value="gpt-4o">GPT-4o</option>
<option value="claude">Claude</option>
<option value="gemini">Gemini</option>

</select>

</div>


{/* input */}

<div className="flex items-center gap-2 px-3 pb-3">

<label className="cursor-pointer">

<Paperclip size={16}/>

<input
type="file"
className="hidden"
onChange={uploadFile}
/>

</label>

<input

value={message}

disabled={loading}

onChange={(e)=>setMessage(e.target.value)}

onKeyDown={(e)=>{

if(e.key==="Enter") sendAI()

}}

placeholder={loading ? "AI is thinking..." : "Ask AI to modify code..."}

className={`flex-1 bg-white/10 text-xs px-3 py-2 rounded outline-none ${loading ? "opacity-50" : ""}`}

/>

<button
onClick={sendAI}
disabled={loading || !message}
className={loading ? "animate-pulse" : ""}
>

<Send size={16} className={loading ? "text-blue-400" : ""}/>

</button>

</div>


</div>


</div>


</div>


</div>

)

}

export default Workspace

