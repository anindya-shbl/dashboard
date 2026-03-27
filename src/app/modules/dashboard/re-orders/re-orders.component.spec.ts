import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReOrdersComponent } from './re-orders.component';

describe('ReOrdersComponent', () => {
  let component: ReOrdersComponent;
  let fixture: ComponentFixture<ReOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReOrdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
