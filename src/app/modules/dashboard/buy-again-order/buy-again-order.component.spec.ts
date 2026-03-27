import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyAgainOrderComponent } from './buy-again-order.component';

describe('BuyAgainOrderComponent', () => {
  let component: BuyAgainOrderComponent;
  let fixture: ComponentFixture<BuyAgainOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyAgainOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyAgainOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
