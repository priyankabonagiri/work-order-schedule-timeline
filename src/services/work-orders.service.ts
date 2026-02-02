import { Injectable, signal } from '@angular/core';
import { WorkOrder, WorkCenter } from '../types/work-order';

const initialWorkCenters: WorkCenter[] = [
  { id: 'wc-1', name: 'Assembly Line A', description: 'Main assembly operations' },
  { id: 'wc-2', name: 'CNC Machining', description: 'Precision machining center' },
  { id: 'wc-3', name: 'Quality Control', description: 'Inspection and testing' },
  { id: 'wc-4', name: 'Packaging', description: 'Final packaging station' },
  { id: 'wc-5', name: 'Welding Station', description: 'Metal welding operations' },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const createDate = (monthOffset: number, day: number, hour: number) => {
  const date = new Date(today);
  date.setMonth(date.getMonth() + monthOffset);
  date.setDate(day);
  date.setHours(hour, 0, 0, 0);
  return date;
};


const initialWorkOrders: WorkOrder[] = [
  {
    id: 'wo-1',
    name: 'WO-2024-001',
    workCenterId: 'wc-1',
    startTime: new Date(today.getTime() + 8 * 60 * 60 * 1000),
    endTime: new Date(today.getTime() + 11 * 60 * 60 * 1000),
    status: 'complete',
  },
  {
    id: 'wo-2',
    name: 'WO-2024-002',
    workCenterId: 'wc-1',
    startTime: new Date(today.getTime() + 12 * 60 * 60 * 1000),
    endTime: new Date(today.getTime() + 15 * 60 * 60 * 1000),
    status: 'in-progress',
  },
  {
    id: 'wo-3',
    name: 'WO-2024-003',
    workCenterId: 'wc-2',
    startTime: new Date(today.getTime() + 9 * 60 * 60 * 1000),
    endTime: new Date(today.getTime() + 13 * 60 * 60 * 1000),
    status: 'in-progress',
  },
  {
    id: 'wo-4',
    name: 'WO-2024-004',
    workCenterId: 'wc-3',
    startTime: createDate(0, 15, 9),
    endTime: createDate(0, 15, 14),
    status: 'open',
  },
  {
    id: 'wo-5',
    name: 'WO-2024-005',
    workCenterId: 'wc-4',
    startTime: createDate(0, 20, 10),
    endTime: createDate(0, 20, 16),
    status: 'blocked',
  },
  {
    id: 'wo-6',
    name: 'WO-2024-006',
    workCenterId: 'wc-1',
    startTime: createDate(1, 5, 8),
    endTime: createDate(1, 5, 12),
    status: 'open',
  },
  {
    id: 'wo-7',
    name: 'WO-2024-007',
    workCenterId: 'wc-2',
    startTime: createDate(1, 12, 9),
    endTime: createDate(1, 12, 15),
    status: 'blocked',
  },
  {
    id: 'wo-8',
    name: 'WO-2024-008',
    workCenterId: 'wc-5',
    startTime: createDate(1, 18, 10),
    endTime: createDate(1, 18, 14),
    status: 'open',
  },
  {
    id: 'wo-9',
    name: 'WO-2024-009',
    workCenterId: 'wc-3',
    startTime: createDate(2, 8, 9),
    endTime: createDate(2, 8, 16),
    status: 'in-progress',
  },
  {
    id: 'wo-10',
    name: 'WO-2024-010',
    workCenterId: 'wc-4',
    startTime: createDate(2, 22, 8),
    endTime: createDate(2, 22, 12),
    status: 'complete',
  },
  {
    id: 'wo-11',
    name: 'WO-2024-011',
    workCenterId: 'wc-1',
    startTime: createDate(3, 10, 9),
    endTime: createDate(3, 10, 17),
    status: 'blocked',
  },
  {
    id: 'wo-12',
    name: 'WO-2024-012',
    workCenterId: 'wc-2',
    startTime: createDate(-1, 15, 8),
    endTime: createDate(-1, 15, 14),
    status: 'complete',
  },
];


@Injectable({
  providedIn: 'root',
})
export class WorkOrdersService {
  // Signals for state management
  private _workOrders = signal<WorkOrder[]>(initialWorkOrders);
  private _workCenters = signal<WorkCenter[]>(initialWorkCenters);

  // Expose as read-only signals
  workOrders = this._workOrders.asReadonly();
  workCenters = this._workCenters.asReadonly();

  addWorkOrder(workOrder: Omit<WorkOrder, 'id'>): WorkOrder {
    const newWorkOrder: WorkOrder = {
      ...workOrder,
      id: `wo-${Date.now()}`,
    };
    
    // Update the signal state
    this._workOrders.update((prev) => [...prev, newWorkOrder]);
    return newWorkOrder;
  }

  updateWorkOrder(id: string, updates: Partial<WorkOrder>): void {
    this._workOrders.update((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, ...updates } : wo))
    );
  }

  deleteWorkOrder(id: string): void {
    this._workOrders.update((prev) => prev.filter((wo) => wo.id !== id));
  }

  /**
   * Returns a filtered list of work orders based on the workCenterId.
   * In Angular 17, you can call this directly in your template:
   * service.getWorkOrdersByWorkCenter('wc-1')
   */
  getWorkOrdersByWorkCenter(workCenterId: string): WorkOrder[] {
    return this._workOrders().filter((wo) => wo.workCenterId === workCenterId);
  }
}