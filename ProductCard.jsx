import React from 'react';
import { ShoppingBag, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/CartContext';
import { useStockpile } from '@/lib/StockpileContext';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isStockpiled, addToStockpile, removeFromStockpile, items } = useStockpile();

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);

  const stockpiled = isStockpiled(product.id);
  const stockpileRecord = items.find(i => i.product_id === product.id);

  const handleStockpileToggle = (e) => {
    e.stopPropagation();
    if (stockpiled && stockpileRecord) {
      removeFromStockpile(stockpileRecord.id);
    } else {
      addToStockpile(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-foreground text-sm font-semibold px-4 py-2 rounded-full">Out of Stock</span>
          </div>
        )}
        {/* Stockpile button */}
        <button
          onClick={handleStockpileToggle}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
            stockpiled
              ? 'bg-primary text-primary-foreground'
              : 'bg-white/90 text-foreground hover:bg-white'
          }`}
        >
          {stockpiled
            ? <BookmarkCheck className="w-4 h-4" />
            : <Bookmark className="w-4 h-4" />
          }
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-heading text-base font-semibold text-foreground mb-1 line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="font-heading text-lg font-bold text-primary">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            disabled={!product.in_stock}
            onClick={() => addItem(product)}
            className="bg-primary hover:bg-primary/90 rounded-full text-xs px-4"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
