import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
          Clonex
        </Link>
        <Link
          to="/login"
          className="rounded-lg border border-border bg-secondary px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          Login
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
