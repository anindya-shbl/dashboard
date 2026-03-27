import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFooterComponent } from './sub-footer.component';

describe('SubFooterComponent', () => {
  let component: SubFooterComponent;
  let fixture: ComponentFixture<SubFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
