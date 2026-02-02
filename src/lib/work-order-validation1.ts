import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { WorkOrder } from '../types/work-order';

/** Form data type for Angular Reactive Forms */
export interface WorkOrderFormData {
  name: string;
  workCenterId: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  startDate: string; // "yyyy-MM-dd"
  endDate: string;   // "yyyy-MM-dd"
  status: 'open' | 'in-progress' | 'complete' | 'blocked';
  description?: string;
  priority: 'low' | 'medium' | 'high';
}

/** Validator to check that end time is after start time */
export const endTimeAfterStartValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;
  const startTime = control.get('startTime')?.value;
  const endTime = control.get('endTime')?.value;

  if (!startDate || !endDate || !startTime || !endTime) {
    return null; // Required validators handle missing fields
  }

  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);

  return end > start ? null : { endBeforeStart: true };
};

/** Validator for name field */
export function validateName(name: string): string | null {
  if (!name?.trim()) return 'Work order name is required';
  if (name.length > 50) return 'Name must be less than 50 characters';
  if (!/^[a-zA-Z0-9\-_\s]+$/.test(name)) return 'Name can only contain letters, numbers, hyphens, and underscores';
  return null;
}

/** Validator for description */
export function validateDescription(description?: string): string | null {
  if (description && description.length > 500) {
    return 'Description must be less than 500 characters';
  }
  return null;
}

/** Check overlap of a new order against existing work orders */
export function checkOverlap(
  newOrder: { startTime: Date; endTime: Date; workCenterId: string; id?: string },
  existingOrders: WorkOrder[]
): WorkOrder | null {
  const ordersInSameWorkCenter = existingOrders.filter(
    (wo) => wo.workCenterId === newOrder.workCenterId && wo.id !== newOrder.id
  );

  for (const existing of ordersInSameWorkCenter) {
    const newStart = newOrder.startTime.getTime();
    const newEnd = newOrder.endTime.getTime();
    const existingStart = existing.startTime.getTime();
    const existingEnd = existing.endTime.getTime();

    if (newStart < existingEnd && newEnd > existingStart) {
      return existing;
    }
  }

  return null;
}
