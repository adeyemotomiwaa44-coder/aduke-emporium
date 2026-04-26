import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/CartContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, ShoppingBag, Package, Home, Truck, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const DEFAULT_LOCATIONS = [
  { name: 'Lagos Island', fee: 1500 },
  { name: 'Lagos Mainland', fee: 2000 },
  { name: 'Lekki / Ajah', fee: 2500 },
  { name: 'Ikeja / Surulere', fee: 2000 },
  { name: 'Others (Contact us)', fee: 3000 },
];

const SHIPPING_METHODS = [
  {
    id: 'stockpile',
    label: 'STOCKPILE',
    icon: Archive,
    fee: 0,
    description: 'We store your order for free for 3 weeks, plus 1 week grace period. After that, a storage fee of ₦500 per day applies.',
  },
  {
    id: 'home_delivery',
    label: 'HOME DELIVERY',
    icon: Home,
    fee: null, // dynamic
    description: 'Select your location below and the delivery fee will be applied automatically.',
  },
  {
    id: 'pickup',
    label: 'PICK UP',
    icon: Package,
    fee: 0,
    description: 'Pick up every Wednesday and Saturday, 12:00pm – 6:00pm.',
  },
  {
    id: 'waybill',
    label: 'WAYBILL (Outside Lagos)',
    icon: Truck,
    fee: 0,
    description: 'Delivery fees apply. Customer pays waybill cost.',
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', customer_address: '', location: '', transfer_reference: '' });
  const [shippingMethod, setShippingMethod] = useState('stockpile');
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  const { data: settings } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const list = await base44.entities.StoreSetting.list('-created_date', 1);
      return list[0] || null;
    },
  });

  const locations = settings?.delivery_locations?.length > 0 ? settings.delivery_locations : DEFAULT_LOCATIONS;
  const selectedLocation = locations.find(l => l.name === form.location);
  const deliveryFee = shippingMethod === 'home_delivery' ? (selectedLocation?.fee || 0) : 0;
  const total = subtotal + deliveryFee;

  const pickupAddress = settings?.pickup_address || 'Contact us for pick-up address';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (shippingMethod === 'home_delivery' && !form.location) {
      toast({ title: 'Please select a delivery location', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const finalTotal = subtotal + deliveryFee;
    await base44.entities.Order.create({
      ...form,
      shipping_method: shippingMethod,
      items,
      subtotal,
      delivery_fee: deliveryFee,
      total: finalTotal,
      status: 'pending',
    });
    setConfirmedTotal(finalTotal);
    clearCart();
    setOrderPlaced(true);
    setSubmitting(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-3">Order Placed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your order. Please transfer <strong>{formatPrice(confirmedTotal)}</strong> to the bank account below:
          </p>
          {settings && (
            <div className="bg-card rounded-xl p-5 border border-border my-6 text-left space-y-2">
              <p className="text-sm"><span className="text-muted-foreground">Bank:</span> <strong>{settings.bank_name}</strong></p>
              <p className="text-sm"><span className="text-muted-foreground">Account:</span> <strong>{settings.account_number}</strong></p>
              <p className="text-sm"><span className="text-muted-foreground">Name:</span> <strong>{settings.account_name}</strong></p>
            </div>
          )}
          <p className="text-sm text-muted-foreground mb-6">
            After payment, share your transfer reference via WhatsApp for faster confirmation.
          </p>
          <div className="flex gap-3 justify-center">
            <a href={`https://wa.me/${settings?.whatsapp_number || '2348118679148'}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full">Chat on WhatsApp</Button>
            </a>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90 rounded-full">Back to Shop</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold mb-2">Your cart is empty</h1>
          <Link to="/products">
            <Button className="bg-primary hover:bg-primary/90 rounded-full mt-4">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-8 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">

            {/* Shipping Method */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-3">
              <h2 className="font-heading text-lg font-semibold">Shipping Method</h2>
              {SHIPPING_METHODS.map(method => {
                const Icon = method.icon;
                const isSelected = shippingMethod === method.id;
                const feeLabel = method.id === 'home_delivery'
                  ? (form.location && selectedLocation ? formatPrice(selectedLocation.fee) : 'Varies')
                  : formatPrice(0);

                return (
                  <label
                    key={method.id}
                    className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={isSelected}
                      onChange={() => setShippingMethod(method.id)}
                      className="mt-0.5 accent-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-sm flex items-center gap-1.5">
                          <Icon className="w-4 h-4 text-primary" />
                          {method.label}
                        </span>
                        <span className="font-bold text-sm text-primary">{feeLabel}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {method.id === 'pickup' ? `${method.description} ${pickupAddress}` : method.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Customer Details */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
              <h2 className="font-heading text-lg font-semibold">Your Details</h2>
              <div>
                <Label>Full Name</Label>
                <Input required value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} placeholder="Enter your name" className="mt-1" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input required value={form.customer_phone} onChange={e => setForm({...form, customer_phone: e.target.value})} placeholder="e.g. 08012345678" className="mt-1" />
              </div>

              {shippingMethod === 'home_delivery' && (
                <>
                  <div>
                    <Label>Delivery Location</Label>
                    <Select value={form.location} onValueChange={val => setForm({...form, location: val})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(loc => (
                          <SelectItem key={loc.name} value={loc.name}>
                            {loc.name} — {formatPrice(loc.fee)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Full Address</Label>
                    <Textarea required value={form.customer_address} onChange={e => setForm({...form, customer_address: e.target.value})} placeholder="Street, landmark, etc." className="mt-1" />
                  </div>
                </>
              )}

              {(shippingMethod === 'waybill' || shippingMethod === 'pickup') && (
                <div>
                  <Label>Address / Notes</Label>
                  <Textarea value={form.customer_address} onChange={e => setForm({...form, customer_address: e.target.value})} placeholder="Any additional notes" className="mt-1" />
                </div>
              )}

              <div>
                <Label>Transfer Reference (optional)</Label>
                <Input value={form.transfer_reference} onChange={e => setForm({...form, transfer_reference: e.target.value})} placeholder="Enter after payment" className="mt-1" />
              </div>
            </div>

            {settings && (
              <div className="bg-accent/10 rounded-2xl p-5 border border-accent/20">
                <h3 className="font-heading text-base font-semibold mb-2">Bank Details</h3>
                <p className="text-sm"><span className="text-muted-foreground">Bank:</span> <strong>{settings.bank_name}</strong></p>
                <p className="text-sm"><span className="text-muted-foreground">Account:</span> <strong>{settings.account_number}</strong></p>
                <p className="text-sm"><span className="text-muted-foreground">Name:</span> <strong>{settings.account_name}</strong></p>
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 rounded-full py-6 font-semibold text-base"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Place Order — {formatPrice(total)}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 border border-border/50 sticky top-24">
              <h2 className="font-heading text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                    <span className="font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shippingMethod === 'home_delivery'
                      ? (form.location ? formatPrice(deliveryFee) : '—')
                      : formatPrice(0)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
