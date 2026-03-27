import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineHomeComponent } from './online-home.component';

describe('OnlineHomeComponent', () => {
  let component: OnlineHomeComponent;
  let fixture: ComponentFixture<OnlineHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlineHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnlineHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
