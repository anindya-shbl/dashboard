import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleHomeComponent } from './article-home.component';

describe('ArticleHomeComponent', () => {
  let component: ArticleHomeComponent;
  let fixture: ComponentFixture<ArticleHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
