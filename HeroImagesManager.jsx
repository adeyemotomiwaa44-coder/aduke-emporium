import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Trash2, Image, GripVertical } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function HeroImagesManager() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', subtitle: '' });

  const { data: heroImages, isLoading } = useQuery({
    queryKey: ['hero-images'],
    queryFn: () => base44.entities.HeroImage.list('order', 10),
    initialData: [],
  });

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (heroImages.length + files.length > 5) {
      toast({ title: 'Max 5 hero images allowed', variant: 'destructive' });
      return;
    }
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: files[i] });
      await base44.entities.HeroImage.create({
        image_url: file_url,
        title: 'Everyday essentials, delivered with care',
        subtitle: 'Discover quality products for your home, style, and wellness',
        order: heroImages.length + i,
      });
    }
    queryClient.invalidateQueries({ queryKey: ['hero-images'] });
    setUploading(false);
    toast({ title: 'Hero image(s) uploaded!' });
    e.target.value = '';
  };

  const handleDelete = async (id) => {
    await base44.entities.HeroImage.delete(id);
    queryClient.invalidateQueries({ queryKey: ['hero-images'] });
  };

  const handleEditSave = async (id) => {
    await base44.entities.HeroImage.update(id, { title: editForm.title, subtitle: editForm.subtitle });
    queryClient.invalidateQueries({ queryKey: ['hero-images'] });
    setEditingId(null);
  };

  const startEdit = (img) => {
    setEditingId(img.id);
    setEditForm({ title: img.title || '', subtitle: img.subtitle || '' });
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-lg flex items-center gap-2">
            <Image className="w-4 h-4 text-primary" /> Hero Slideshow Images
          </CardTitle>
          <span className="text-sm text-muted-foreground">{heroImages.length}/5</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Upload up to 5 images for the homepage hero slideshow. If none are uploaded, default images will be shown.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-3">
            {heroImages.map((img, idx) => (
              <div key={img.id} className="border border-border rounded-xl overflow-hidden">
                <div className="flex gap-3 p-3">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    <img src={img.image_url} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingId === img.id ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Slide title"
                          value={editForm.title}
                          onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                          className="text-sm h-8"
                        />
                        <Input
                          placeholder="Slide subtitle"
                          value={editForm.subtitle}
                          onChange={e => setEditForm(p => ({ ...p, subtitle: e.target.value }))}
                          className="text-sm h-8"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90" onClick={() => handleEditSave(img.id)}>Save</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-sm truncate">{img.title || 'No title set'}</p>
                        <p className="text-xs text-muted-foreground truncate">{img.subtitle || 'No subtitle set'}</p>
                        <button
                          onClick={() => startEdit(img)}
                          className="text-xs text-primary hover:underline mt-1"
                        >
                          Edit text
                        </button>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive flex-shrink-0"
                    onClick={() => handleDelete(img.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {heroImages.length < 5 && (
              <label className={`flex items-center gap-3 border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                {uploading
                  ? <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  : <Upload className="w-5 h-5 text-muted-foreground" />
                }
                <div>
                  <p className="text-sm font-medium">{uploading ? 'Uploading...' : 'Upload image(s)'}</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WEBP · Max {5 - heroImages.length} more</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            )}

            {heroImages.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-2">No custom images yet — default slides are in use.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
