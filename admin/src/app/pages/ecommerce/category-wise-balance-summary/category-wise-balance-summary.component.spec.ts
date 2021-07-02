import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWiseBalanceSummaryComponent } from './category-wise-balance-summary.component';

describe('CategoryWiseBalanceSummaryComponent', () => {
  let component: CategoryWiseBalanceSummaryComponent;
  let fixture: ComponentFixture<CategoryWiseBalanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryWiseBalanceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryWiseBalanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
