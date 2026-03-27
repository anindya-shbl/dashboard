import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSubheaderComponent } from './article-subheader.component';

describe('ArticleSubheaderComponent', () => {
  let component: ArticleSubheaderComponent;
  let fixture: ComponentFixture<ArticleSubheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleSubheaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleSubheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
