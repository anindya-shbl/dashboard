import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JitoGenericsComponent } from './jito-generics.component';

describe('JitoGenericsComponent', () => {
  let component: JitoGenericsComponent;
  let fixture: ComponentFixture<JitoGenericsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JitoGenericsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JitoGenericsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
