import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWiseArticlesComponent } from './category-wise-articles.component';

describe('CategoryWiseArticlesComponent', () => {
  let component: CategoryWiseArticlesComponent;
  let fixture: ComponentFixture<CategoryWiseArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryWiseArticlesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryWiseArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
