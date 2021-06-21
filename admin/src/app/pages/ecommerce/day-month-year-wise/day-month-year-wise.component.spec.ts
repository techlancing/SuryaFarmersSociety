import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayMonthYearWiseComponent } from './day-month-year-wise.component';

describe('DayMonthYearWiseComponent', () => {
  let component: DayMonthYearWiseComponent;
  let fixture: ComponentFixture<DayMonthYearWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayMonthYearWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayMonthYearWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
