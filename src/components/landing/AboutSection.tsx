import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Native Workspace",
    description: "Choose your preferred model and generate apps, interfaces, or systems with full context and control.",
  },
  {
    title: "Persistent Projects",
    description: "Every build is securely stored with model selection, attachments, and configuration history.",
  },
  {
    title: "Built For Creators",
    description: "Designed for developers, founders, and teams who want speed without sacrificing control.",
  },
];

const AboutSection = () => {
  return (
    <section className="w-full border-t border-white/5 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold text-white mb-6 text-center"
        >
          About Clonex
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed text-center"
        >
          Clonex is an AI-powered development workspace that turns ideas into production-ready applications directly in your browser. No setup. No heavy machines. Just pure creation.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl bg-white/3 border border-white/5 p-8 hover:bg-white/5 transition duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
