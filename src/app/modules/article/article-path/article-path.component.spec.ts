import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePathComponent } from './article-path.component';

describe('ArticlePathComponent', () => {
  let component: ArticlePathComponent;
  let fixture: ComponentFixture<ArticlePathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticlePathComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticlePathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
