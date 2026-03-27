import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularPackagesComponent } from './popular-packages.component';

describe('PopularPackagesComponent', () => {
  let component: PopularPackagesComponent;
  let fixture: ComponentFixture<PopularPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopularPackagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopularPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
