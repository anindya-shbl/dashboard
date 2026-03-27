import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthFeedsComponent } from './health-feeds.component';

describe('HealthFeedsComponent', () => {
  let component: HealthFeedsComponent;
  let fixture: ComponentFixture<HealthFeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthFeedsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
