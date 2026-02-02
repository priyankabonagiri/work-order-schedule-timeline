import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineHeaderComponent } from './timeline-header.component';

describe('TimeLineHeaderComponent', () => {
  let component: TimelineHeaderComponent;
  let fixture: ComponentFixture<TimelineHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelineHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
