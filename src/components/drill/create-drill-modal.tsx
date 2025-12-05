'use client';

import { useState } from 'react';
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

interface CreateDrillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDrillModal({
  open,
  onOpenChange,
}: CreateDrillModalProps) {
  const { createDrill } = useDrills();
  const [title, setTitle] = useState('');
  const [pricePerMinute, setPricePerMinute] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !pricePerMinute) {
      return;
    }

    setIsSubmitting(true);

    try {
      const price = parseFloat(pricePerMinute);
      await createDrill({ title: title.trim(), pricePerMinute: price });

      // Reset form and close modal only on success
      setTitle('');
      setPricePerMinute('');
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the hook and toast - keep modal open
      console.error('Create drill error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setPricePerMinute('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Створити новий Drill</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2"
              >
                Назва:
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Введіть назву drill..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium mb-2"
              >
                Ціна за хвилину (грн):
              </label>
              <Input
                id="price"
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

          <div className="mt-2 p-3 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg">
            <p className="text-xs text-[var(--foreground-muted)]">
              💡 Після створення drill ви зможете додати користувачів на головній сторінці
            </p>
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
                  Створення...
                </div>
              ) : (
                'Створити'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
