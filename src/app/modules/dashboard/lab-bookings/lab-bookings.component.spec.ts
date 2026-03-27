import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabBookingsComponent } from './lab-bookings.component';

describe('LabBookingsComponent', () => {
  let component: LabBookingsComponent;
  let fixture: ComponentFixture<LabBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
