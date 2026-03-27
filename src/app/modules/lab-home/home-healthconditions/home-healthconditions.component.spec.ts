import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHealthconditionsComponent } from './home-healthconditions.component';

describe('HomeHealthconditionsComponent', () => {
  let component: HomeHealthconditionsComponent;
  let fixture: ComponentFixture<HomeHealthconditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeHealthconditionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeHealthconditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
