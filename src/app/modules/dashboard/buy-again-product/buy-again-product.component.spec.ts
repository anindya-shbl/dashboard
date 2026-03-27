import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyAgainProductComponent } from './buy-again-product.component';

describe('BuyAgainProductComponent', () => {
  let component: BuyAgainProductComponent;
  let fixture: ComponentFixture<BuyAgainProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyAgainProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyAgainProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
