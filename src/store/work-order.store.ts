import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { WorkOrder } from '../types/work-order';

const today = new Date();
today.setHours(0, 0, 0, 0);

const createDate = (monthOffset: number, day: number, hour: number) => {
  const date = new Date(today);
  date.setMonth(date.getMonth() + monthOffset);
  date.setDate(day);
  date.setHours(hour, 0, 0, 0);
  return date;
};


@Injectable({ providedIn: 'root' })
export class WorkOrderStore {

  /** Internal state */
  private readonly _workOrders$ = new BehaviorSubject<WorkOrder[]>([]);


  /** Observable for components */
  readonly workOrders$ = this._workOrders$.asObservable();
  

  constructor() {
    const today = new Date();
    // 👇 mock data
    const mockWorkOrders: WorkOrder[] = [
      {
        id: 'wo-1',
        name: 'WO-2024-001',
        workCenterId: 'wc-1',
        startTime: new Date('2026-01-31T00:00:00'),
        endTime: new Date('2024-01-31T00:00:00'),
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

    this._workOrders$.next(mockWorkOrders);
  }

  /** Snapshot getter */
  get value(): WorkOrder[] {
    return this._workOrders$.value;
  }

  /** Set full list (initial load / reset) */
  setAll(workOrders: WorkOrder[]): void {
    this._workOrders$.next(workOrders);
  }

  /** Add new work order */
  add(workOrder: WorkOrder): void {
    this._workOrders$.next([
      ...this.value,
      workOrder
    ]);
  }

  /** Update existing work order */
  update(id: string, updates: Partial<WorkOrder>): void {
    const updated = this.value.map(wo =>
      wo.id === id ? { ...wo, ...updates } : wo
    );
    this._workOrders$.next(updated);
  }

  /** Delete */
  remove(id: string): void {
    this._workOrders$.next(
      this.value.filter(wo => wo.id !== id)
    );
  }

  /** Clear all */
  clear(): void {
    this._workOrders$.next([]);
  }
}
