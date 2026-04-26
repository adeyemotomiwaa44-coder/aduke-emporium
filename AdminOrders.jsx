import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-purple-100 text-purple-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 500),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Order.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">Orders</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No orders found</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <Card key={order.id} className="bg-card">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold">{order.customer_name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || statusColors.pending}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.customer_phone} · {order.location}
                      {order.shipping_method && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {order.shipping_method === 'home_delivery' ? '🏠 Home Delivery'
                            : order.shipping_method === 'stockpile' ? '📦 Stockpile'
                            : order.shipping_method === 'pickup' ? '🏪 Pick Up'
                            : order.shipping_method === 'waybill' ? '🚚 Waybill'
                            : order.shipping_method}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.items?.length || 0} items · {formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_date).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(status) => updateMutation.mutate({ id: order.id, status })}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => setSelected(order)}>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Order Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Name:</span><br /><strong>{selected.customer_name}</strong></div>
                <div><span className="text-muted-foreground">Phone:</span><br /><strong>{selected.customer_phone}</strong></div>
                <div><span className="text-muted-foreground">Location:</span><br /><strong>{selected.location || '—'}</strong></div>
                <div><span className="text-muted-foreground">Status:</span><br /><strong>{selected.status}</strong></div>
                {selected.shipping_method && (
                  <div><span className="text-muted-foreground">Shipping:</span><br /><strong className="capitalize">{selected.shipping_method.replace('_', ' ')}</strong></div>
                )}
                <div className="col-span-2"><span className="text-muted-foreground">Address:</span><br /><strong>{selected.customer_address}</strong></div>
                {selected.transfer_reference && (
                  <div className="col-span-2"><span className="text-muted-foreground">Transfer Ref:</span><br /><strong>{selected.transfer_reference}</strong></div>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Items</h4>
                <div className="space-y-2">
                  {selected.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm p-2 bg-secondary rounded-lg">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(selected.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatPrice(selected.delivery_fee)}</span></div>
                <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span className="text-primary">{formatPrice(selected.total)}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
