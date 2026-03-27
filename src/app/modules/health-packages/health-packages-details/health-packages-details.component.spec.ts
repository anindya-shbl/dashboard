import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthPackagesDetailsComponent } from './health-packages-details.component';

describe('HealthPackagesDetailsComponent', () => {
  let component: HealthPackagesDetailsComponent;
  let fixture: ComponentFixture<HealthPackagesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthPackagesDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthPackagesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
