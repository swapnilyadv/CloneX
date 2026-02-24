import { motion } from "framer-motion";
import { Zap, Shield, Cpu } from "lucide-react";

const tips = [
  { icon: Zap, text: "Use natural language prompts for faster code generation." },
  { icon: Shield, text: "Enable two-factor authentication for account security." },
  { icon: Cpu, text: "Switch AI agents based on your task for best results." },
];

const Tips = () => {
  return (
    <section className="border-t border-border py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl"
        >
          Pro Tips
        </motion.h2>

        <div className="grid gap-4 md:grid-cols-3">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="surface-card flex items-start gap-4 p-6"
            >
              <tip.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm leading-relaxed text-muted-foreground">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tips;
