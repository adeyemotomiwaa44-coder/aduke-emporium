import React from 'react';
import { useStockpile } from '@/lib/StockpileContext';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, BookmarkX, ShoppingCart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);

export default function Stockpile() {
  const { items, loading, removeFromStockpile } = useStockpile();
  const { addItem } = useCart();

  const handleMoveToCart = (item) => {
    addItem({
      id: item.product_id,
      name: item.product_name,
      price: item.product_price,
      image_url: item.product_image,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">My Stockpile</h1>
          <p className="text-muted-foreground">Items you've saved for later</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkX className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-heading text-xl font-semibold mb-2">Your stockpile is empty</h2>
            <p className="text-muted-foreground mb-6">Browse products and tap the bookmark icon to save items here</p>
            <Link to="/products">
              <Button className="bg-primary hover:bg-primary/90 rounded-full">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map(item => (
                <div key={item.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden flex gap-4 p-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">{item.product_category}</p>
                    <h3 className="font-semibold text-sm leading-snug truncate">{item.product_name}</h3>
                    <p className="text-primary font-bold mt-1">{formatPrice(item.product_price)}</p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 rounded-full text-xs flex-1"
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                        onClick={() => removeFromStockpile(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/products">
                <Button variant="outline" className="rounded-full">Continue Shopping</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
