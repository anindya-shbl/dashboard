import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePathComponent } from './route-path.component';

describe('RoutePathComponent', () => {
  let component: RoutePathComponent;
  let fixture: ComponentFixture<RoutePathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoutePathComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoutePathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
