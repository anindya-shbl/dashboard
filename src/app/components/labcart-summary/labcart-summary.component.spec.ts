import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabcartSummaryComponent } from './labcart-summary.component';

describe('LabcartSummaryComponent', () => {
  let component: LabcartSummaryComponent;
  let fixture: ComponentFixture<LabcartSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabcartSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabcartSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
