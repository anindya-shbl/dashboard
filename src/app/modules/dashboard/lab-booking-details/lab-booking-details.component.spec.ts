import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabBookingDetailsComponent } from './lab-booking-details.component';

describe('LabBookingDetailsComponent', () => {
  let component: LabBookingDetailsComponent;
  let fixture: ComponentFixture<LabBookingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabBookingDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
