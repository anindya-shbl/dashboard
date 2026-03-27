import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabListsComponent } from './tab-lists.component';

describe('TabListsComponent', () => {
  let component: TabListsComponent;
  let fixture: ComponentFixture<TabListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabListsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
