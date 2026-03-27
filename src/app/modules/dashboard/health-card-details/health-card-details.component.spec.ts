import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCardDetailsComponent } from './health-card-details.component';

describe('HealthCardDetailsComponent', () => {
  let component: HealthCardDetailsComponent;
  let fixture: ComponentFixture<HealthCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthCardDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
