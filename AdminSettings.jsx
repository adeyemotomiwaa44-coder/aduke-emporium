import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Save, Upload, Image } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import HeroImagesManager from '@/components/admin/HeroImagesManager';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    bank_name: '', account_number: '', account_name: '',
    delivery_locations: [{ name: '', fee: '' }],
    pickup_address: '',
    support_phone: '', whatsapp_number: '', contact_email: '', telegram_url: '',
  });
  const [settingsId, setSettingsId] = useState(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const list = await base44.entities.StoreSetting.list('-created_date', 1);
      return list[0] || null;
    },
  });

  useEffect(() => {
    if (settings) {
      setSettingsId(settings.id);
      setForm({
        bank_name: settings.bank_name || '',
        account_number: settings.account_number || '',
        account_name: settings.account_name || '',
        delivery_locations: settings.delivery_locations?.length > 0 ? settings.delivery_locations : [{ name: '', fee: '' }],
        pickup_address: settings.pickup_address || '',
        support_phone: settings.support_phone || '',
        whatsapp_number: settings.whatsapp_number || '',
        contact_email: settings.contact_email || '',
        telegram_url: settings.telegram_url || '',
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        delivery_locations: data.delivery_locations.filter(l => l.name).map(l => ({ name: l.name, fee: Number(l.fee) || 0 })),
        pickup_address: data.pickup_address,
      };
      if (settingsId) {
        return base44.entities.StoreSetting.update(settingsId, payload);
      }
      return base44.entities.StoreSetting.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({ title: 'Settings saved!' });
    },
  });

  const addLocation = () => setForm(prev => ({
    ...prev,
    delivery_locations: [...prev.delivery_locations, { name: '', fee: '' }],
  }));

  const removeLocation = (idx) => setForm(prev => ({
    ...prev,
    delivery_locations: prev.delivery_locations.filter((_, i) => i !== idx),
  }));

  const updateLocation = (idx, field, value) => {
    setForm(prev => ({
      ...prev,
      delivery_locations: prev.delivery_locations.map((l, i) => i === idx ? { ...l, [field]: value } : l),
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-6">Settings</h1>

      <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-6 max-w-2xl">
        <Card className="bg-card">
          <CardHeader><CardTitle className="font-heading text-lg">Bank Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Bank Name</Label>
              <Input value={form.bank_name} onChange={e => setForm({...form, bank_name: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input value={form.account_number} onChange={e => setForm({...form, account_number: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Account Name</Label>
              <Input value={form.account_name} onChange={e => setForm({...form, account_name: e.target.value})} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-lg">Delivery Locations & Fees</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addLocation}>
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {form.delivery_locations.map((loc, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  placeholder="Location name"
                  value={loc.name}
                  onChange={e => updateLocation(idx, 'name', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Fee (₦)"
                  type="number"
                  value={loc.fee}
                  onChange={e => updateLocation(idx, 'fee', e.target.value)}
                  className="w-28"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeLocation(idx)} className="text-destructive flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader><CardTitle className="font-heading text-lg">Pick-Up Address</CardTitle></CardHeader>
          <CardContent>
            <Label>Pick-Up Location Address</Label>
            <Input
              value={form.pickup_address}
              onChange={e => setForm({...form, pickup_address: e.target.value})}
              placeholder="e.g. 12 Akin Adesola St, Victoria Island, Lagos"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">This address is shown to customers who choose the Pick Up shipping option.</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader><CardTitle className="font-heading text-lg">Contact Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Support Phone</Label>
              <Input value={form.support_phone} onChange={e => setForm({...form, support_phone: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>WhatsApp Number</Label>
              <Input value={form.whatsapp_number} onChange={e => setForm({...form, whatsapp_number: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Telegram URL</Label>
              <Input value={form.telegram_url} onChange={e => setForm({...form, telegram_url: e.target.value})} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saveMutation.isPending} className="bg-primary hover:bg-primary/90 rounded-full px-8">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </form>

      <div className="mt-8 max-w-2xl">
        <HeroImagesManager />
      </div>
    </div>
  );
}
