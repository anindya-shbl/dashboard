import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleBookingComponent } from './reschedule-booking.component';

describe('RescheduleBookingComponent', () => {
  let component: RescheduleBookingComponent;
  let fixture: ComponentFixture<RescheduleBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RescheduleBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RescheduleBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
