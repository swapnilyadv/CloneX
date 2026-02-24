import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Create Account", description: "Sign up in seconds with email or GitHub." },
  { number: "02", title: "Connect GitHub", description: "Link your repositories for seamless workflow." },
  { number: "03", title: "Start Coding with AI", description: "Write, debug, and ship code with AI agents." },
];

const HowItWorks = () => {
  return (
    <section className="border-t border-border py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center text-3xl font-bold text-foreground md:text-4xl"
        >
          How it works
        </motion.h2>

        <div className="space-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex items-start gap-8"
            >
              <span className="flex-shrink-0 text-4xl font-bold text-muted-foreground/30">
                {step.number}
              </span>
              <div>
                <h3 className="mb-1 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
