import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthConditionsComponent } from './health-conditions.component';

describe('HealthConditionsComponent', () => {
  let component: HealthConditionsComponent;
  let fixture: ComponentFixture<HealthConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthConditionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
