import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopByBrandsComponent } from './shop-by-brands.component';

describe('ShopByBrandsComponent', () => {
  let component: ShopByBrandsComponent;
  let fixture: ComponentFixture<ShopByBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopByBrandsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopByBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
