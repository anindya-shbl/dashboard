import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateConsultationComponent } from './rate-consultation.component';

describe('RateConsultationComponent', () => {
  let component: RateConsultationComponent;
  let fixture: ComponentFixture<RateConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RateConsultationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RateConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
