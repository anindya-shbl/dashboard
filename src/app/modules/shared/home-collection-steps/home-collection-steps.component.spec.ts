import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCollectionStepsComponent } from './home-collection-steps.component';

describe('HomeCollectionStepsComponent', () => {
  let component: HomeCollectionStepsComponent;
  let fixture: ComponentFixture<HomeCollectionStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeCollectionStepsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeCollectionStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
