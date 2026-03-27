import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAgainLabtestComponent } from './book-again-labtest.component';

describe('BookAgainLabtestComponent', () => {
  let component: BookAgainLabtestComponent;
  let fixture: ComponentFixture<BookAgainLabtestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookAgainLabtestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookAgainLabtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
