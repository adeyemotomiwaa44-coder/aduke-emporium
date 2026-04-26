import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark, ShoppingBag } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);

export default function PopularStockpile() {
  const { data: stockpileItems } = useQuery({
    queryKey: ['admin-stockpile'],
    queryFn: () => base44.entities.Stockpile.list('-created_date', 500),
    initialData: [],
  });

  // Aggregate by product_id, count occurrences
  const productCounts = {};
  stockpileItems.forEach(item => {
    const id = item.product_id;
    if (!productCounts[id]) {
      productCounts[id] = {
        product_id: id,
        name: item.product_name,
        price: item.product_price,
        image: item.product_image,
        category: item.product_category,
        count: 0,
      };
    }
    productCounts[id].count += 1;
  });

  const top = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (top.length === 0) return null;

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-primary" /> Popular Stockpiled Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {top.map((item, idx) => (
            <div key={item.product_id} className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground w-5">{idx + 1}</span>
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category} · {formatPrice(item.price)}</p>
              </div>
              <span className="text-sm font-bold text-primary">{item.count}×</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
