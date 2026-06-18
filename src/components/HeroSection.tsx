import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeInUp, stagger } from "../lib/motion";

const images = ["/home.avif", "/home2.avif"];
const INTERVAL = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Carousel images */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={current}
          src={images[current]}
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay sutil solo para legibilidad del texto */}
      <div className="absolute inset-0 bg-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 text-center"
      >
        <motion.div variants={fadeInUp} className="mb-5 sm:mb-6">
          <span className="inline-block px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-medium tracking-widest text-accent border border-accent/30 rounded-full uppercase">
            Nueva Coleccion 2026
          </span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="font-bold tracking-tight leading-[1.05] mb-5 sm:mb-6"
          style={{ fontSize: "clamp(2rem, 8vw, 4.5rem)" }}
        >
          <span className="text-text-primary">STREETWEAR</span>
          <br />
          <span className="text-text-primary">CON </span>
          <span className="text-accent">ALMA</span>
          <br />
          <span className="text-text-primary">JAPONESA</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-sm sm:text-base text-text-secondary max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
        >
          Ropa urbana inspirada en la cultura anime y el street style japones.
          Disenos exclusivos, materiales premium, hechos en Argentina.
        </motion.p>

        <motion.div variants={fadeInUp}>
          <Link
            to="/coleccion"
            className="group inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 bg-text-primary text-background font-semibold text-sm tracking-wide rounded-sm hover:bg-accent transition-colors duration-200"
          >
            VER COLECCION
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-sm sm:max-w-md mx-auto"
        >
          {[
            { value: "1.5K+", label: "Clientes" },
            { value: "6", label: "Colecciones" },
            { value: "100%", label: "Premium" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-accent">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs text-text-muted mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-accent w-6"
                  : "bg-text-muted/40 hover:bg-text-muted/60"
              }`}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
