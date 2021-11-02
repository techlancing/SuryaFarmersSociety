import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySavingsDepositComponent } from './daily-savings-deposit.component';

describe('DailySavingsDepositComponent', () => {
  let component: DailySavingsDepositComponent;
  let fixture: ComponentFixture<DailySavingsDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailySavingsDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailySavingsDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
