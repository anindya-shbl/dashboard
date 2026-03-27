import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabLandingComponent } from './lab-landing.component';

describe('LabLandingComponent', () => {
  let component: LabLandingComponent;
  let fixture: ComponentFixture<LabLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabLandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
