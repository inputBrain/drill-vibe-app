'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUsers } from '@/hooks/use-users';
import type { UserDto } from '@/types';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserDto | null;
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const { updateUser } = useUsers();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({});

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email || '');
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: { firstName?: string; lastName?: string; email?: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = "Ім'я обов'язкове";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Прізвище обов'язкове";
    }

    // Simple email validation: just check if it contains @ symbol
    if (email.trim() && !email.includes('@')) {
      newErrors.email = "Email має містити символ @";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUser({
        userId: user.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || null,
      });

      // Reset form and close modal only on success
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the hook and toast - keep modal open
      console.error('Update user error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Редагувати користувача</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-firstName" className="block text-sm font-medium mb-2">
                Ім'я <span className="text-[var(--danger)]">*</span>
              </label>
              <Input
                id="edit-firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Введіть ім'я"
                className={errors.firstName ? 'border-[var(--danger)]' : ''}
              />
              {errors.firstName && (
                <p className="text-[var(--danger)] text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-lastName" className="block text-sm font-medium mb-2">
                Прізвище <span className="text-[var(--danger)]">*</span>
              </label>
              <Input
                id="edit-lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Введіть прізвище"
                className={errors.lastName ? 'border-[var(--danger)]' : ''}
              />
              {errors.lastName && (
                <p className="text-[var(--danger)] text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium mb-2">
                Email <span className="text-[var(--foreground-muted)] text-xs">(необов'язково)</span>
              </label>
              <Input
                id="edit-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className={errors.email ? 'border-[var(--danger)]' : ''}
              />
              {errors.email && (
                <p className="text-[var(--danger)] text-sm mt-1">{errors.email}</p>
              )}
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
              disabled={isSubmitting}
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
