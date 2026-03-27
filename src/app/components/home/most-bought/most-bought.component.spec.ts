import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostBoughtComponent } from './most-bought.component';

describe('MostBoughtComponent', () => {
  let component: MostBoughtComponent;
  let fixture: ComponentFixture<MostBoughtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostBoughtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostBoughtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
