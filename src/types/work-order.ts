export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

export type ZoomLevel = 'day' | 'week' | 'month' | 'year';

export interface WorkOrder {
  id: string;
  name: string;
  workCenterId: string;
  startTime: Date;
  endTime: Date;
  status: WorkOrderStatus;
}

export interface WorkCenter {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface TimelineConfig {
  zoomLevel: ZoomLevel;
  startDate: Date;
  unitWidth: number;
  rowHeight: number;
  unitsVisible: number;
}

export interface OverlapError {
  workOrderId?: string;
  message: string;
}
