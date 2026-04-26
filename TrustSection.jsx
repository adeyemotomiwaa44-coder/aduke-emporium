import React from 'react';
import { Shield, Truck, CreditCard, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  { name: 'Amina O.', text: 'Fast delivery and great quality! I always come back for more.', rating: 5 },
  { name: 'Chidi K.', text: 'Best online store for home essentials. Highly recommended!', rating: 5 },
  { name: 'Funke A.', text: 'The wellness products changed my routine. Love the variety!', rating: 5 },
];

const features = [
  { icon: Shield, title: 'Trusted Quality', desc: 'Every product is carefully vetted' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Delivered to your doorstep' },
  { icon: CreditCard, title: 'Secure Payment', desc: 'Pay via bank transfer' },
];

export default function TrustSection() {
  return (
    <>
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array(t.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm mb-4 italic">"{t.text}"</p>
                <p className="font-semibold text-sm">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">How Payment Works</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            We use a simple <strong>pay before delivery</strong> model. After placing your order, you'll receive our bank details.
            Make a transfer and share your reference — we'll confirm and dispatch your items promptly.
            This ensures a smooth, trustworthy experience for everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-card rounded-full px-5 py-2.5 border border-border/50">
              <span className="text-lg">1️⃣</span>
              <span className="text-sm font-medium">Place Order</span>
            </div>
            <div className="flex items-center gap-2 bg-card rounded-full px-5 py-2.5 border border-border/50">
              <span className="text-lg">2️⃣</span>
              <span className="text-sm font-medium">Transfer Payment</span>
            </div>
            <div className="flex items-center gap-2 bg-card rounded-full px-5 py-2.5 border border-border/50">
              <span className="text-lg">3️⃣</span>
              <span className="text-sm font-medium">Get Delivered</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
