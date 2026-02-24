import { motion } from "framer-motion";
import { Bot, Monitor, Github, Languages } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Agents Inside Editor",
    description: "Use ChatGPT, DeepSeek, and more directly in your coding environment.",
  },
  {
    icon: Monitor,
    title: "No Device Dependency",
    description: "Code from any device — all processing happens in the cloud.",
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description: "Connect your repos, push code, and collaborate seamlessly.",
  },
  {
    icon: Languages,
    title: "Multi-Language Support",
    description: "Write in Python, JavaScript, TypeScript, Go, Rust, and more.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Features = () => {
  return (
    <section id="features" className="border-t border-border py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl"
        >
          Everything you need
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-16 text-center text-muted-foreground"
        >
          Powerful tools, zero setup.
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="surface-card p-8 transition-colors hover:border-muted-foreground/20"
            >
              <f.icon className="mb-4 h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
