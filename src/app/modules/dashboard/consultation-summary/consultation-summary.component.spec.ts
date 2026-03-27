import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationSummaryComponent } from './consultation-summary.component';

describe('ConsultationSummaryComponent', () => {
  let component: ConsultationSummaryComponent;
  let fixture: ComponentFixture<ConsultationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultationSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
