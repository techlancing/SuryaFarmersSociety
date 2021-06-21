import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCategoryBalanceSummaryComponent } from './all-category-balance-summary.component';

describe('AllCategoryBalanceSummaryComponent', () => {
  let component: AllCategoryBalanceSummaryComponent;
  let fixture: ComponentFixture<AllCategoryBalanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCategoryBalanceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCategoryBalanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
