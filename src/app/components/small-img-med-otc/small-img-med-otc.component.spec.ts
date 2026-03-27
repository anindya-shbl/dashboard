import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallImgMedOTCComponent } from './small-img-med-otc.component';

describe('SmallImgMedOTCComponent', () => {
  let component: SmallImgMedOTCComponent;
  let fixture: ComponentFixture<SmallImgMedOTCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmallImgMedOTCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmallImgMedOTCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
