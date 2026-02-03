import { Injectable, signal } from '@angular/core';
import { WorkCenter } from '../types/work-order';

const initialWorkCenters: WorkCenter[] = [
  { id: 'wc-1', name: 'Assembly Line A', description: 'Main assembly operations' },
  { id: 'wc-2', name: 'CNC Machining', description: 'Precision machining center' },
  { id: 'wc-3', name: 'Quality Control', description: 'Inspection and testing' },
  { id: 'wc-4', name: 'Packaging', description: 'Final packaging station' },
  { id: 'wc-5', name: 'Welding Station', description: 'Metal welding operations' },
];

@Injectable({
  providedIn: 'root',
})
export class WorkOrdersService {
  // Signals for state management
  private _workCenters = signal<WorkCenter[]>(initialWorkCenters);

  // Expose as read-only signals
  workCenters = this._workCenters.asReadonly();
}