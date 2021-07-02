import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCategoryWiseBalanceSummaryComponent } from './all-category-wise-balance-summary.component';

describe('AllCategoryWiseBalanceSummaryComponent', () => {
  let component: AllCategoryWiseBalanceSummaryComponent;
  let fixture: ComponentFixture<AllCategoryWiseBalanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCategoryWiseBalanceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCategoryWiseBalanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
