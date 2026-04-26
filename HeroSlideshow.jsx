import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const DEFAULT_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',
    title: 'Everyday essentials, delivered with care',
    subtitle: 'Discover quality products for your home, style, and wellness',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1600&q=80',
    title: 'Elevate your everyday living',
    subtitle: 'Premium home & kitchen essentials at your fingertips',
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
    title: 'Style that speaks for you',
    subtitle: 'Curated fashion pieces for every occasion',
  },
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  const { data: heroImages } = useQuery({
    queryKey: ['hero-images'],
    queryFn: () => base44.entities.HeroImage.list('order', 10),
    initialData: [],
  });

  const slides = heroImages.length > 0
    ? heroImages.map(h => ({
        image: h.image_url,
        title: h.title || 'Everyday essentials, delivered with care',
        subtitle: h.subtitle || 'Discover quality products for your home, style, and wellness',
      }))
    : DEFAULT_SLIDES;

  useEffect(() => {
    setCurrent(0);
  }, [heroImages.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[75vh] min-h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current]?.image})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {slides[current]?.title}
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-8 font-body">
                {slides[current]?.subtitle}
              </p>
              <Link to="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base rounded-full">
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === current ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
