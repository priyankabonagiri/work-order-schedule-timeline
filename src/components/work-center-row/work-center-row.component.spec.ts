import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCenterRowComponent } from './work-center-row.component';

describe('WorkCenterRowComponent', () => {
  let component: WorkCenterRowComponent;
  let fixture: ComponentFixture<WorkCenterRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkCenterRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkCenterRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
