import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            ¿Hablamos<span className="text-gradient">?</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-8" />

          <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
            Estoy abierto a nuevas oportunidades, colaboraciones y proyectos interesantes. 
            Conectemos a través de mis redes profesionales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/stiven-mazo-87040a207/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-300"
            >
              <Linkedin className="w-5 h-5" />
              Conectar en LinkedIn
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="https://github.com/Mazomenos21"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-accent transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              Ver GitHub
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 Stiven Mazo · Hecho con pasión desde Medellín 🇨🇴
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
