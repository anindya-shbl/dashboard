import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderOtcComponent } from './order-otc.component';

describe('OrderOtcComponent', () => {
  let component: OrderOtcComponent;
  let fixture: ComponentFixture<OrderOtcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderOtcComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderOtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
