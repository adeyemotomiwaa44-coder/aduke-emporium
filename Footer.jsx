import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-0.5 mb-4">
              <span className="font-heading text-2xl font-bold text-primary-foreground">Aduke</span>
              <span className="font-heading text-2xl font-bold text-background">Emporium</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Everyday essentials, delivered with care. Your trusted online store for quality products.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-background mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-background/60 hover:text-background transition-colors">Home</Link>
              <Link to="/products" className="block text-sm text-background/60 hover:text-background transition-colors">Shop All</Link>
              <Link to="/products?category=Fashion" className="block text-sm text-background/60 hover:text-background transition-colors">Fashion</Link>
              <Link to="/products?category=Wellness" className="block text-sm text-background/60 hover:text-background transition-colors">Wellness</Link>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-background mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a href="tel:+2348118679148" className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors">
                <Phone className="w-4 h-4" /> +234 811 867 9148
              </a>
              <a href="mailto:kdeborah164@gmail.com" className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors">
                <Mail className="w-4 h-4" /> kdeborah164@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 flex items-center justify-between">
          <p className="text-xs text-background/40">© {new Date().getFullYear()} Aduke Emporium. All rights reserved.</p>
          <Link to="/admin" className="text-background/20 hover:text-background/40 transition-colors">
            <Lock className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
