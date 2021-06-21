import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBalanceSummaryComponent } from './category-balance-summary.component';

describe('CategoryBalanceSummaryComponent', () => {
  let component: CategoryBalanceSummaryComponent;
  let fixture: ComponentFixture<CategoryBalanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryBalanceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryBalanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
