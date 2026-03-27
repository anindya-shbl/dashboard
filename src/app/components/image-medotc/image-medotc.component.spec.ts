import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMedotcComponent } from './image-medotc.component';

describe('ImageMedotcComponent', () => {
  let component: ImageMedotcComponent;
  let fixture: ComponentFixture<ImageMedotcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageMedotcComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageMedotcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
