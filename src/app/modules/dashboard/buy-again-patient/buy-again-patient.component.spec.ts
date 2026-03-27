import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyAgainPatientComponent } from './buy-again-patient.component';

describe('BuyAgainPatientComponent', () => {
  let component: BuyAgainPatientComponent;
  let fixture: ComponentFixture<BuyAgainPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyAgainPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyAgainPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
