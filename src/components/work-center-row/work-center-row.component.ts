import {
  Component,
  Input,
  Output,
  EventEmitter,
  Signal,
  computed,
  effect,
  input,
} from '@angular/core';
import {
  isSameDay,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  startOfYear,
  endOfYear,
  addWeeks,
} from 'date-fns';

import { WorkCenter, WorkOrder, TimelineConfig } from '../../types/work-order';
import { CommonModule } from '@angular/common';
import { WorkOrderCardComponent } from '../work-order-card/work-order-card.component';
// import { WorkOrderCardComponent } from './work-order-card.component';

@Component({
  selector: 'app-work-center-row',
  standalone: true,
  imports: [CommonModule, WorkOrderCardComponent],
  templateUrl: './work-center-row.component.html',
  styleUrl: './work-center-row.component.scss'
})
export class WorkCenterRowComponent {

  /* ---------- Inputs ---------- */

  @Input({ required: true }) workCenter!: WorkCenter;

  workOrders = input<WorkOrder[]>([]);
  config = input.required<TimelineConfig>();


  /* ---------- Outputs ---------- */

  @Output() workOrderEdit = new EventEmitter<WorkOrder>();
  @Output() workOrderDelete = new EventEmitter<WorkOrder>();

  /* ---------- Computed ---------- */

  visibleWorkOrders = computed(() => {
    const config: TimelineConfig = this.config();
    console.log('Calculating visible work orders for work center:', this.workOrders());
    if (config.zoomLevel === 'day') {
      return this.workOrders().filter(wo =>
        isSameDay(wo.startTime, config.startDate)
      );
    }

    if (config.zoomLevel === 'week') {
      const start = startOfWeek(config.startDate, { weekStartsOn: 1 });
      const end = endOfWeek(config.startDate, { weekStartsOn: 1 });

      return this.workOrders().filter(wo =>
        isWithinInterval(wo.startTime, { start, end })
      );
    }

    if (config.zoomLevel === 'month') {
      const start = startOfMonth(config.startDate);
      const end = addWeeks(start, 5);

      return this.workOrders().filter(wo =>
        isWithinInterval(wo.startTime, { start, end })
      );
    }

    const start = startOfYear(config.startDate);
    const end = endOfYear(config.startDate);

    return this.workOrders().filter(wo =>
      isWithinInterval(wo.startTime, { start, end })
    );
  });

  totalWidth = computed(
    () => this.config().unitsVisible * this.config().unitWidth
  );
}
