import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestReturnComponent } from './request-return.component';

describe('RequestReturnComponent', () => {
  let component: RequestReturnComponent;
  let fixture: ComponentFixture<RequestReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestReturnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
