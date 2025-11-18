"use client";

import React, { useEffect, useState } from "react";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80",
    alt: "Playas de México",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
    alt: "Ciudades coloniales de México",
  },
  {
    src: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1600&q=80",
    alt: "Cenotes y naturaleza mexicana",
  },
  {
    src: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=80",
    alt: "Cultura y festivales en México",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  return (
    <div className="carousel relative rounded-3xl overflow-hidden">
      <div className="slides relative w-full h-full">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={`slide absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            aria-hidden={i !== index}
          >
            <img src={s.src} alt={s.alt} className="w-full h-full object-cover" />
            {i === index && (
              <div className="absolute left-6 bottom-6 text-white">
                <div className="text-sm uppercase tracking-widest text-amber-200/90 font-semibold">Operamos en</div>
                <div className="text-2xl md:text-3xl font-extrabold leading-tight">México — Experiencias estudiantiles</div>
                <div className="mt-1 text-sm text-sky-100/80">Rutas y convenios con instituciones mexicanas.</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button aria-label="Anterior" onClick={prev} className="carousel-btn left-3">
        ‹
      </button>
      <button aria-label="Siguiente" onClick={next} className="carousel-btn right-3">
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
