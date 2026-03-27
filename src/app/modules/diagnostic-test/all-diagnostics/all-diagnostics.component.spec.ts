import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDiagnosticsComponent } from './all-diagnostics.component';

describe('AllDiagnosticsComponent', () => {
  let component: AllDiagnosticsComponent;
  let fixture: ComponentFixture<AllDiagnosticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllDiagnosticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllDiagnosticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
