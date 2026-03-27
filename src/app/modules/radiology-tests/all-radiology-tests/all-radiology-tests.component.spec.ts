import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRadiologyTestsComponent } from './all-radiology-tests.component';

describe('AllRadiologyTestsComponent', () => {
  let component: AllRadiologyTestsComponent;
  let fixture: ComponentFixture<AllRadiologyTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllRadiologyTestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllRadiologyTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
