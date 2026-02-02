import { Component, computed, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimelineHeaderComponent } from '../components/timeline-header/timeline-header.component';
import { WorkOrder, TimelineConfig,ZoomLevel } from '../types/work-order';
import { WorkOrdersService } from '../services/work-orders.service';
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, format } from 'date-fns';
import { WorkCenterRowComponent } from '../components/work-center-row/work-center-row.component';
import { WorkOrderPanelComponent } from '../components/work-order-panel/work-order-panel.component';
import { CommonModule } from '@angular/common';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrderStore } from '../store/work-order.store';
import { map, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

const getConfig = (zoomLevel: ZoomLevel, startDate: Date): TimelineConfig => {
  switch (zoomLevel) {
    case 'day':
      return {
        zoomLevel,
        startDate,
        unitWidth: 100,
        rowHeight: 64,
        unitsVisible: 14,
      };
    case 'week':
      return {
        zoomLevel,
        startDate,
        unitWidth: 140,
        rowHeight: 64,
        unitsVisible: 7,
      };
    case 'month':
      return {
        zoomLevel,
        startDate,
        unitWidth: 180,
        rowHeight: 64,
        unitsVisible: 5,
      };
    case 'year':
      return {
        zoomLevel,
        startDate,
        unitWidth: 120,
        rowHeight: 64,
        unitsVisible: 12,
      };
  }
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TimelineHeaderComponent,
    WorkCenterRowComponent,
    WorkOrderPanelComponent,
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('sideNav') sideNav!: MatDrawer;
  drawerOpen = false;

  workOrdersSig = toSignal(this.store.workOrders$, {
    initialValue: []
  });


  
  private workOrdersService = inject(WorkOrdersService);

  // ✅ Signals exposed to template
  workCenters = this.workOrdersService.workCenters;
  
  workOrders: WorkOrder[] = [];

   // ===== State (signals) =====
  zoomLevel = signal<ZoomLevel>('week');
  currentDate = signal(new Date());
  selectedWorkOrder = signal<WorkOrder | null>(null);

  defaultWorkCenterId = signal<string | undefined>(undefined);
  defaultStartHour = signal<number | undefined>(undefined);

  // ===== Computed config =====
  config = computed(() =>
    getConfig(this.zoomLevel(), this.currentDate())
  );

  constructor(private store: WorkOrderStore) {}

   // ===== Handlers =====

  handleWorkOrderEdit(workOrder: WorkOrder) {
    this.selectedWorkOrder.set({ ...workOrder });
    this.openSideNav();
  }

  handleWorkOrderDelete(workOrder: WorkOrder) {
    this.store.remove(workOrder.id);
  }

  workOrdersByCenter = computed(() => {
    const map = new Map<string, WorkOrder[]>();

    for (const wo of this.workOrdersSig()) {
      if (!map.has(wo.workCenterId)) {
        map.set(wo.workCenterId, []);
      }
      map.get(wo.workCenterId)!.push(wo);
    }

    return map;
  });

  ngOnInit() {
    this.workOrders = this.store.value;
  }

  openSideNav() {
    this.sideNav.open();
  }

  closeSideNav() {
    this.sideNav.close();
  }

  createNewWorkOrder() {
    this.selectedWorkOrder.set(null);
    this.openSideNav();
  }

}
