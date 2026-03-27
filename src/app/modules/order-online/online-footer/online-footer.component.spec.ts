import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineFooterComponent } from './online-footer.component';

describe('OnlineFooterComponent', () => {
  let component: OnlineFooterComponent;
  let fixture: ComponentFixture<OnlineFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlineFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnlineFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
