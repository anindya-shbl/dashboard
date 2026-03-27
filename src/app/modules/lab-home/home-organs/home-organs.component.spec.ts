import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOrgansComponent } from './home-organs.component';

describe('HomeOrgansComponent', () => {
  let component: HomeOrgansComponent;
  let fixture: ComponentFixture<HomeOrgansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeOrgansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeOrgansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
