import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackLabBookingComponent } from './track-lab-booking.component';

describe('TrackLabBookingComponent', () => {
  let component: TrackLabBookingComponent;
  let fixture: ComponentFixture<TrackLabBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackLabBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackLabBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
