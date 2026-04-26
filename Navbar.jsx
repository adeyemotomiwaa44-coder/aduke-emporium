import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Bookmark } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useStockpile } from '@/lib/StockpileContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const { items: stockpileItems } = useStockpile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-0.5">
            <span className="font-heading text-2xl font-bold text-primary">Aduke</span>
            <span className="font-heading text-2xl font-bold text-foreground">Emporium</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Home</Link>
            <Link to="/products" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Shop</Link>
            <Link to="/products?category=Fashion" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Fashion</Link>
            <Link to="/products?category=Wellness" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Wellness</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/stockpile"
              className="relative p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Bookmark className="w-5 h-5 text-foreground" />
              {stockpileItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {stockpileItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary">Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary">Shop</Link>
            <Link to="/products?category=Fashion" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary">Fashion</Link>
            <Link to="/products?category=Wellness" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary">Wellness</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
