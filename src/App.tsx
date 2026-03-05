
import { Routes, Route } from "react-router-dom"

import Index from "./pages/Index"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AppDashboard from "./pages/AppDashboard"
import ProjectView from "./pages/ProjectView"
import Workspace from "./pages/Workspace"
import NotFound from "./pages/NotFound"

function App() {

  return (

    <Routes>

      {/* Landing Website */}
      <Route path="/" element={<Index />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* App */}
      <Route path="/app" element={<AppDashboard />} />
      <Route path="/app/project/:id" element={<ProjectView />} />
      <Route path="/app/workspace/:id" element={<Workspace />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />

    </Routes>

  )

}

export default App

