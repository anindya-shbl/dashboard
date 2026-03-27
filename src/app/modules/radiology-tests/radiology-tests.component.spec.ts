import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyTestsComponent } from './radiology-tests.component';

describe('RadiologyTestsComponent', () => {
  let component: RadiologyTestsComponent;
  let fixture: ComponentFixture<RadiologyTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiologyTestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadiologyTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
