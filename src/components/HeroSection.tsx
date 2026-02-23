import { motion } from "framer-motion";
import { Github, Linkedin, MapPin, GraduationCap } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      
      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-28 h-28 mx-auto mb-8 rounded-full overflow-hidden glow-border ring-2 ring-primary/30"
          >
            <img
              src="https://avatars.githubusercontent.com/u/114029629?v=4"
              alt="Stiven Mazo"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">
            Hi, I'm
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-foreground">
            Stiven <span className="text-gradient">Mazo</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
            💻 Software Development Fullstack &nbsp;·&nbsp; 📊 Data Analyst &nbsp;·&nbsp;
            <br/>
            👷🏻‍♂️ Computer Engineering &nbsp;·&nbsp; 🗺 DevOps & Cloud Engineering
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-10">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              Medellín, Colombia
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-primary" />
              <a href="https://www.politecnicojic.edu.co/">Politécnico Colombiano Jaime Isaza Cadavid</a>
            </span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/Mazomenos21"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/stiven-mazo-87040a207/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 font-medium"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse-glow" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
