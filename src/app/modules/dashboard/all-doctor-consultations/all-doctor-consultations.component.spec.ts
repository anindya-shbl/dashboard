import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDoctorConsultationsComponent } from './all-doctor-consultations.component';

describe('AllDoctorConsultationsComponent', () => {
  let component: AllDoctorConsultationsComponent;
  let fixture: ComponentFixture<AllDoctorConsultationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllDoctorConsultationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllDoctorConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
