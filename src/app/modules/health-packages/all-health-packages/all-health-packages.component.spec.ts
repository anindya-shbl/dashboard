import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllHealthPackagesComponent } from './all-health-packages.component';

describe('AllHealthPackagesComponent', () => {
  let component: AllHealthPackagesComponent;
  let fixture: ComponentFixture<AllHealthPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllHealthPackagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllHealthPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
