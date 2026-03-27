import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedcartSummeryComponent } from './medcart-summery.component';

describe('MedcartSummeryComponent', () => {
  let component: MedcartSummeryComponent;
  let fixture: ComponentFixture<MedcartSummeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedcartSummeryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedcartSummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
