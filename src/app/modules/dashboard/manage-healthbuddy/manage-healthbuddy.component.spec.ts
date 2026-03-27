import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHealthbuddyComponent } from './manage-healthbuddy.component';

describe('ManageHealthbuddyComponent', () => {
  let component: ManageHealthbuddyComponent;
  let fixture: ComponentFixture<ManageHealthbuddyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageHealthbuddyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageHealthbuddyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
