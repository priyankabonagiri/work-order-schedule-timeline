import { Component, Input, Output, EventEmitter, computed, OnDestroy, input } from '@angular/core';
import { WorkOrder, TimelineConfig, WorkCenter } from '../../types/work-order';
// import { differenceInDays, differenceInMinutes, differenceInMonths, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);

interface StatusConfigItem {
  className: string;
  label: string;
}

const statusConfig: Record<string, StatusConfigItem> = {
  open: { className: 'bg-status-open text-status-open-foreground', label: 'Open' },
  'in-progress': { className: 'bg-status-in-progress text-status-in-progress-foreground', label: 'In Progress' },
  complete: { className: 'bg-status-complete text-status-complete-foreground', label: 'Complete' },
  blocked: { className: 'bg-status-blocked text-status-blocked-foreground', label: 'Blocked' },
};

const cardConfig: Record<string, { className: string }> = {
  open: { className: 'bg-card-open' },
  'in-progress': { className: 'bg-card-in-progress' },
  complete: { className: 'bg-card-complete' },
  blocked: { className: 'bg-card-blocked' },
};

@Component({
  selector: 'app-work-order-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-order-card.component.html',
  styleUrls: ['./work-order-card.component.scss'],
})
export class WorkOrderCardComponent {
  @Input({ required: true }) workOrder!: WorkOrder;
  config = input.required<TimelineConfig>();

  @Output() clicked = new EventEmitter<WorkOrder>();
  @Output() edit = new EventEmitter<WorkOrder>();
  @Output() delete = new EventEmitter<WorkOrder>();

  showActions = false;

  position = computed(() => this.calculatePosition());


  private calculatePosition() {
    let left = 0;
    let width = 0;
    console.log('Calculating position for work order:', this.workOrder.id);
    const wo = this.workOrder;
    const cfg = this.config();

    const start = dayjs(wo.startTime);
    const end = dayjs(wo.endTime);
    const startDate = dayjs(cfg.startDate);

    if (cfg.zoomLevel === 'day') {
      const startHour = start.hour() + start.minute() / 60;
      const endHour = end.hour() + end.minute() / 60;

      const dayStart = 6;

      left = (startHour - dayStart) * cfg.unitWidth;
      width = (endHour - startHour) * cfg.unitWidth;
    }

    else if (cfg.zoomLevel === 'week') {
      // Week starts on Monday
      const weekStart = startDate.startOf('isoWeek').toDate(); // Monday Jan 26


      const start = dayjs(wo.startTime).startOf('day');
      const end = dayjs(wo.endTime).startOf('day');

      // 1️⃣ Column index (0 = Monday)
      const startDayOffset = Math.max(0, start.diff(weekStart, 'day')); // 0-6

      // 2️⃣ Duration in days (inclusive of start & end day)
      const totalDays = end.diff(start, 'day') + 1; // add 1 so Tue->Wed = 2 days

      // 3️⃣ Calculate left & width in pixels
      left = startDayOffset * cfg.unitWidth;
      width = totalDays * cfg.unitWidth;
    }

    else if (cfg.zoomLevel === 'month') {
      // Month timeline starts at first visible week (Monday)
      const timelineStart = startDate.startOf('month').startOf('week');

      const startWeekIndex = start.diff(timelineStart, 'week');
      const endWeekIndex = end.diff(timelineStart, 'week');

      // Day index inside week (0 = Mon, 6 = Sun)
      const startDayIndex = start.day() === 0 ? 6 : start.day() - 1;
      const endDayIndex = end.day() === 0 ? 6 : end.day() - 1;

      const startDayFraction = startDayIndex / 7;
      const endDayFraction = (endDayIndex + 1) / 7;

      left =
        (startWeekIndex + startDayFraction) * cfg.unitWidth;

      width =
        ((endWeekIndex - startWeekIndex - 1) +
          (1 - startDayFraction) +
          endDayFraction) * cfg.unitWidth;
      console.log('Calculated left:', left, 'width:', width);
    }

    else {
      // Year view
      const yearStart = startDate.startOf('year');

      const startMonthIndex = start.diff(yearStart, 'month');
      const endMonthIndex = end.diff(yearStart, 'month');

      // Fraction inside start month
      const startDayFraction =
        (start.date() - 1) / start.daysInMonth();

      // Fraction inside end month
      const endDayFraction =
        end.date() / end.daysInMonth();

      left =
        (startMonthIndex + startDayFraction) * cfg.unitWidth;

      width =
        ((endMonthIndex - startMonthIndex - 1) +
          endDayFraction +
          (1 - startDayFraction)) * cfg.unitWidth;

      console.log('Calculated left:', left, 'width:', width);
    }

    return {
      left: Math.max(0, left),
      width: Math.max(width, 60)
    };
  }



  // private calculatePosition() {
  //   let left = 0;
  //   let width = 0;
  //   const wo = this.workOrder;
  //   const cfg = this.config;
  //   // console.log('Calculating position for work order:', wo.id);
  //   // console.log('cfg.zoomLevel:', cfg.zoomLevel);
  //   if (cfg.zoomLevel === 'day') {
  //     const startHour = wo.startTime.getHours() + wo.startTime.getMinutes() / 60;
  //     const endHour = wo.endTime.getHours() + wo.endTime.getMinutes() / 60;
  //     // console.log('Start Hour:', startHour, 'End Hour:', endHour);
  //     const dayStart = 6;
  //     left = (startHour - dayStart) * cfg.unitWidth;
  //     width = (endHour - startHour) * cfg.unitWidth;
  //   } else if (cfg.zoomLevel === 'week') {
  //     // console.log('Calculating position for work order in week view:', wo);
  //     const weekStart = startOfWeek(cfg.startDate, { weekStartsOn: 1 });
  //     console.log('weekStart:', weekStart);
  //     const startDay = differenceInDays(wo.startTime, weekStart);
  //     console.log('differenceInDays(wo.startTime, weekStart)', wo.startTime, weekStart , startDay); 
  //     const startHourFraction = (wo.startTime.getHours() - 6) / 14;
  //     console.log('startHourFraction', startHourFraction);
  //     // console.log('wo.startTime.getHours()', wo.startTime.getHours());
  //     const durationFraction = differenceInMinutes(wo.endTime, wo.startTime) / 60 / 14;
  //     console.log('durationFraction', durationFraction);
  //     left = (startDay + Math.max(0, startHourFraction)) * cfg.unitWidth;
  //     width = Math.max(durationFraction * cfg.unitWidth, 20);
  //   } else if (cfg.zoomLevel === 'month') {
  //     // console.log('wo.id:', wo.id);
  //     const monthStart = startOfMonth(cfg.startDate);
  //     // console.log('differenceInDays(wo.startTime, monthStart)', wo.startTime, monthStart , differenceInDays(wo.startTime, monthStart));
  //     const startWeek = Math.round(differenceInDays(wo.startTime, monthStart) / 7);
  //     const durationWeeks = (differenceInDays(wo.endTime, wo.startTime) || 1) / 7;
  //     console.log('wo', wo, 'monthStart:', monthStart, 'Start Week:', startWeek, 'Duration Weeks:', durationWeeks);
  //     left = startWeek * cfg.unitWidth;
  //     width = Math.max(durationWeeks * cfg.unitWidth, 30);
  //     console.log('Calculated left:', left, 'width:', width);
  //   } else {
  //     const yearStart = startOfYear(cfg.startDate);
  //     const startMonth = differenceInMonths(wo.startTime, yearStart);
  //     const dayInMonth = wo.startTime.getDate() / 30;
  //     const durationMonths = (differenceInDays(wo.endTime, wo.startTime) || 1) / 30;
  //     // console.log('wo', wo, 'yearStart:', yearStart, 'Start Month:', startMonth, 'Day in Month:', dayInMonth, 'Duration Months:', durationMonths);
  //     left = (startMonth + dayInMonth) * cfg.unitWidth;
  //     width = Math.max(durationMonths * cfg.unitWidth, 20);
  //   }

  //   return { left: Math.max(0, left), width: Math.max(width, 60) };
  // }

  get status() {
    return statusConfig[this.workOrder.status] || { className: '', label: '' };
  }

  get cardStyle() {
    return cardConfig[this.workOrder.status]?.className || '';
  }


  onEditClick(event: MouseEvent) {
    event.stopPropagation();
    this.edit.emit(this.workOrder);
  }

  onDeleteClick(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit(this.workOrder);
  }

  onClick() {
    this.clicked.emit(this.workOrder);
  }
}
