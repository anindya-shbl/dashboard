import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestStatusComponent } from './service-request-status.component';

describe('ServiceRequestStatusComponent', () => {
  let component: ServiceRequestStatusComponent;
  let fixture: ComponentFixture<ServiceRequestStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceRequestStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceRequestStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
