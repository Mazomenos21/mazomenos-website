import { motion } from "framer-motion";
import { User, BookOpen, Globe } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-2xl p-8 md:p-10"
        >
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-8">
            I'm Stiven Mazo, a computer engineer from Medellín, Colombia. I have a solid technical foundation built through formal training in software development, a degree in Computer Engineering, and multiple certifications from platforms such as Udemy, SENA, and Coursera. I'm guided by strong personal principles—responsibility, respect, humility—and by a genuine passion for continuous learning. I stay consistently engaged with the latest trends, tools, and advancements in technology. Additionally, I have a strong command of the English language and continue to refine it to reach professional fluency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: User, label: "Profile", value: "Fullstack - Data Analyst - DevOps" },
              { icon: BookOpen, label: "Education", value: "Computer Engineering" },
              { icon: Globe, label: "Languages", value: "Español · English" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
