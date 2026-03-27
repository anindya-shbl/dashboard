import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlernativeProductComponent } from './alernative-product.component';

describe('AlernativeProductComponent', () => {
  let component: AlernativeProductComponent;
  let fixture: ComponentFixture<AlernativeProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlernativeProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlernativeProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
