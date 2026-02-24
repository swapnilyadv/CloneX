import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast({ title: "Login failed", description: error, variant: "destructive" });
    } else {
      navigate("/app");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="mb-10 block text-center text-2xl font-bold text-foreground">
          Clonex
        </Link>

        <h2 className="mb-1 text-center text-xl font-semibold text-foreground">Welcome back</h2>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-foreground py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-foreground underline underline-offset-4 hover:opacity-80">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
