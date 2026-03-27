import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgansComponent } from './organs.component';

describe('OrgansComponent', () => {
  let component: OrgansComponent;
  let fixture: ComponentFixture<OrgansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrgansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrgansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
