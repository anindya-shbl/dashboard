import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticTestComponent } from './diagnostic-test.component';

describe('DiagnosticTestComponent', () => {
  let component: DiagnosticTestComponent;
  let fixture: ComponentFixture<DiagnosticTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiagnosticTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiagnosticTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
