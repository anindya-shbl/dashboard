import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedScrollerComponent } from './med-scroller.component';

describe('MedScrollerComponent', () => {
  let component: MedScrollerComponent;
  let fixture: ComponentFixture<MedScrollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedScrollerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
