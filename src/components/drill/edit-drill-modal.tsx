'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDrills } from '@/hooks/use-drills';
import type { DrillDto } from '@/lib/api-client';

interface EditDrillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drill: DrillDto | null;
}

export function EditDrillModal({
  open,
  onOpenChange,
  drill,
}: EditDrillModalProps) {
  const { updateDrill } = useDrills();
  const [title, setTitle] = useState('');
  const [pricePerMinute, setPricePerMinute] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (drill) {
      setTitle(drill.title);
      setPricePerMinute(drill.pricePerMinute.toString());
    }
  }, [drill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!drill || !title.trim() || !pricePerMinute) {
      return;
    }

    setIsSubmitting(true);

    try {
      const price = parseFloat(pricePerMinute);
      await updateDrill({
        drillId: drill.id,
        title: title.trim(),
        pricePerMinute: price,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Update drill error:', error);
    } finally{
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!drill) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Редагувати Drill</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="edit-title"
                className="block text-sm font-medium mb-2"
              >
                Назва:
              </label>
              <Input
                id="edit-title"
                type="text"
                placeholder="Введіть назву drill..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="edit-price"
                className="block text-sm font-medium mb-2"
              >
                Ціна за хвилину (грн):
              </label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={pricePerMinute}
                onChange={(e) => setPricePerMinute(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !title.trim() || !pricePerMinute}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Збереження...
                </div>
              ) : (
                'Зберегти'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
