import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Home & Kitchen',
    emoji: '🏠',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    description: 'Essentials for every home',
  },
  {
    name: 'Fashion',
    emoji: '👗',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    description: 'Style for every occasion',
  },
  {
    name: 'Wellness',
    emoji: '❤️',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    description: 'Care for body & mind',
  },
  {
    name: 'Mobility',
    emoji: '🚲',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    description: 'Move with ease',
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">Shop by Category</h2>
          <p className="text-muted-foreground font-body">Find exactly what you need</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[3/2]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <span className="text-2xl sm:text-3xl mb-1 block">{cat.emoji}</span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-white">{cat.name}</h3>
                  <p className="text-white/70 text-sm font-body hidden sm:block">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
