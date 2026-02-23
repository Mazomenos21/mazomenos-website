import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, MapPin, GraduationCap } from "lucide-react";

const HeroSection = () => {
  // Estado para controlar el lightbox (imagen ampliada)
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Evitar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Cerrar con Escape (si estamos en fullscreen, salir del fullscreen primero)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        else setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen]);
  const githubRef = useRef(null);
  const linkedinRef = useRef(null);

  // Asegurarse de resetear fullscreen cuando cerramos el modal
  const handleClose = () => {
    setIsFullscreen(false);
    setIsOpen(false);
  };

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
            {/* Hacemos la imagen clicable para abrir el lightbox */}
            <button
              aria-label="Abrir imagen en vista ampliada"
              onClick={() => setIsOpen(true)}
              className="w-full h-full block"
              style={{ padding: 0, border: 0, background: 'transparent' }}
            >
              <img
                ref={imageRef}
                src="https://avatars.githubusercontent.com/u/114029629?v=4"
                alt="Stiven Mazo"
                className="w-full h-full object-cover"
              />
            </button>
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
              <Github className="w-5 h-5" ref={githubRef}/>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/stiven-mazo-87040a207/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 font-medium"
            >
              <Linkedin className="w-5 h-5" ref={linkedinRef}/>
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

      {/* Lightbox / modal para la imagen expandida */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="hero-image-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal={true}
            role="dialog"
            onClick={(e) => {
              // Si estamos en fullscreen, al hacer click fuera minimizamos; si no, cerramos el modal
              if (e.target === e.currentTarget) {
                if (isFullscreen) setIsFullscreen(false);
                else handleClose();
              }
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Contenedor de la imagen con animación */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className={
                "relative mx-4 rounded-lg overflow-hidden shadow-2xl z-10 " +
                (isFullscreen
                  ? "fixed inset-0 m-0 flex items-center justify-center bg-black"
                  : "max-w-[90vw] max-h-[90vh] w-auto")
              }
            >
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  aria-label={isFullscreen ? "Minimizar imagen" : "Expandir imagen"}
                  onClick={() => setIsFullscreen((s) => !s)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
                >
                  {isFullscreen ? "▣" : "▢"}
                </button>

                <button
                  aria-label="Cerrar vista ampliada"
                  onClick={handleClose}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
                >
                  ×
                </button>
              </div>

              <img
                src="https://avatars.githubusercontent.com/u/114029629?v=4"
                alt="Stiven Mazo"
                className={
                  "bg-black " +
                  (isFullscreen ? "w-full h-full object-cover" : "w-full h-full object-contain max-h-[80vh]")
                }
                onClick={() => {
                  // Dentro del modal, un click alterna entre expandir/minimizar en lugar de cerrar
                  setIsFullscreen((s) => !s);
                }}
                style={{ cursor: isFullscreen ? 'zoom-out' : 'zoom-in' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
