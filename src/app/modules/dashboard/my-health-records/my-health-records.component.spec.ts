import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHealthRecordsComponent } from './my-health-records.component';

describe('MyHealthRecordsComponent', () => {
  let component: MyHealthRecordsComponent;
  let fixture: ComponentFixture<MyHealthRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyHealthRecordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyHealthRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
