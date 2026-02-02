import { Component, Input, Signal, computed } from '@angular/core';
import { format, addDays, startOfWeek, startOfMonth, addWeeks, startOfYear, addMonths } from 'date-fns';
import { TimelineConfig } from '../../types/work-order';
import { CommonModule } from '@angular/common';

interface TimelineUnit {
  key: string;
  label: string;
  subLabel?: string;
}

@Component({
  selector: 'app-timeline-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-header.component.html',
  styleUrl: './timeline-header.component.scss',
})
export class TimelineHeaderComponent {

  @Input({ required: true }) config!: Signal<TimelineConfig>;

  units = computed<TimelineUnit[]>(() => {
    const units: TimelineUnit[] = [];
    const config = this.config();
    if (config.zoomLevel === 'day') {
      // Show hours for day view (6 AM to 8 PM)
      for (let i = 0; i < config.unitsVisible; i++) {
        const hour = 6 + i;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        units.push({
          key: `hour-${i}`,
          label: `${displayHour}:00`,
          subLabel: ampm,
        });
      }
    } else if (config.zoomLevel === 'week') {
      // Show days for week view
      const weekStart = startOfWeek(config.startDate, { weekStartsOn: 1 });
      for (let i = 0; i < 7; i++) {
        const day = addDays(weekStart, i);
        units.push({
          key: `day-${i}`,
          label: format(day, 'EEE'),
          subLabel: format(day, 'MMM d'),
        });
      }
    } else if (config.zoomLevel === 'month') {
      // Show weeks for month view
      const monthStart = startOfMonth(config.startDate);
      for (let i = 0; i < 5; i++) {
        const weekStart = addWeeks(monthStart, i);
        units.push({
          key: `week-${i}`,
          label: `Week ${i + 1}`,
          subLabel: format(weekStart, 'MMM d'),
        });
      }
    } else {
      // Show months for year view
      const yearStart = startOfYear(config.startDate);
      for (let i = 0; i < 12; i++) {
        const month = addMonths(yearStart, i);
        units.push({
          key: `month-${i}`,
          label: format(month, 'MMM'),
          subLabel: format(month, 'yyyy'),
        });
      }
    }
    return units;
  });
}
