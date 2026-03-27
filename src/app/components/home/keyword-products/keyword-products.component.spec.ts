import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordProductsComponent } from './keyword-products.component';

describe('KeywordProductsComponent', () => {
  let component: KeywordProductsComponent;
  let fixture: ComponentFixture<KeywordProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeywordProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KeywordProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
