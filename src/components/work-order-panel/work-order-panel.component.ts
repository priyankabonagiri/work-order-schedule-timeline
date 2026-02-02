import { Component, effect, EventEmitter, inject, Input, Output, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { WorkOrder } from '../../types/work-order';
import { Subscription } from 'rxjs';
import { WorkOrderStore } from '../../store/work-order.store';
import dayjs from 'dayjs';
import { WorkOrdersService } from '../../services/work-orders.service';

function formatDateYYYYMMDD(dateStr: string | Date): string {
  const d = new Date(dateStr);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`; // "YYYY-MM-DD"
}

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './work-order-panel.component.html',
  styleUrls: ['./work-order-panel.component.scss'],
})
export class WorkOrderPanelComponent {
  @Input() workOrder!: WritableSignal<WorkOrder | null>;

  @Output() closeDrawer: EventEmitter<void> = new EventEmitter<void>();
  @Output() update = new EventEmitter<{ id: string; updates: Partial<WorkOrder> }>();
  private sub!: Subscription;

  private workOrdersService = inject(WorkOrdersService);
  // ✅ Signals exposed to template
  workCenters = this.workOrdersService.workCenters;

  selectedWorkOrder = signal<WorkOrder | null>(null);

  workOrderForm!: FormGroup;
  isEditing = false;

  statuses = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Complete', value: 'complete' },
    { label: 'Blocked', value: 'blocked' },
  ];


  constructor(private fb: FormBuilder, private store: WorkOrderStore
) {
    const wo = this.workOrder?.();
    this.isEditing = !!wo;
    // Initialize the form first
    this.workOrderForm = this.fb.group({
      workCenterId: [null, Validators.required],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      status: [null, Validators.required], // defaulted to null
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });


    // Reactive effect: will run every time the signal value changes
    effect(() => {
      const wo = this.workOrder();
      this.isEditing = !!wo;
      if (wo) {
        this.workOrderForm.patchValue({
          workCenterId: wo.workCenterId,
          name: wo.name,
          status: wo.status,
          startDate: formatDateYYYYMMDD(wo.startTime),
          endDate: formatDateYYYYMMDD(wo.endTime),
        });
      }
    });
  }

  onSubmit() {
    if (this.workOrderForm.invalid) {
      this.workOrderForm.markAllAsTouched();
      return;
    }

    const formValue = this.workOrderForm.value;
    if (!!this.workOrder()){
      let id: string = this.workOrder()?.id ?? '';
      this.store.update(id, formValue);
    } else {
      const newWorkOrder: WorkOrder = {
        id: `wo-${Date.now()}`,
        name: formValue.name,
        workCenterId: formValue.workCenterId,
        startTime: dayjs(formValue.startDate).startOf('day').toDate(),
        endTime: dayjs(formValue.endDate).endOf('day').toDate(),
        status: formValue.status,
      };
      this.store.add(newWorkOrder);
      this.workOrderForm.reset();
    }

    // Close drawer
    this.closeDrawer.emit();
  }

  onCancel() {
    this.workOrderForm.reset();
    this.selectedWorkOrder.set(null);
    this.closeDrawer.emit();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
