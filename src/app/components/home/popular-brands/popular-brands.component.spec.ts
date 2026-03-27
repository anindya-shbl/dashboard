import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularBrandsComponent } from './popular-brands.component';

describe('PopularBrandsComponent', () => {
  let component: PopularBrandsComponent;
  let fixture: ComponentFixture<PopularBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopularBrandsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopularBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
