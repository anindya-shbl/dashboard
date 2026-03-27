import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCardsListComponent } from './health-cards-list.component';

describe('HealthCardsListComponent', () => {
  let component: HealthCardsListComponent;
  let fixture: ComponentFixture<HealthCardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthCardsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthCardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
