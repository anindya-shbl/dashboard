import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePackagesComponent } from './home-packages.component';

describe('HomePackagesComponent', () => {
  let component: HomePackagesComponent;
  let fixture: ComponentFixture<HomePackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePackagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
