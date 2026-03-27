import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedNotesComponent } from './med-notes.component';

describe('MedNotesComponent', () => {
  let component: MedNotesComponent;
  let fixture: ComponentFixture<MedNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
