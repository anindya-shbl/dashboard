import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthPackagesComponent } from './health-packages.component';

describe('HealthPackagesComponent', () => {
  let component: HealthPackagesComponent;
  let fixture: ComponentFixture<HealthPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthPackagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
