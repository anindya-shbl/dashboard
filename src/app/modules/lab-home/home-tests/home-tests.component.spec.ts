import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTestsComponent } from './home-tests.component';

describe('HomeTestsComponent', () => {
  let component: HomeTestsComponent;
  let fixture: ComponentFixture<HomeTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeTestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
