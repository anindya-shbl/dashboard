import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineSliderComponent } from './online-slider.component';

describe('OnlineSliderComponent', () => {
  let component: OnlineSliderComponent;
  let fixture: ComponentFixture<OnlineSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlineSliderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnlineSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
