import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsTypeDepositTransactionComponent } from './savings-type-deposit-transaction.component';

describe('SavingsTypeDepositTransactionComponent', () => {
  let component: SavingsTypeDepositTransactionComponent;
  let fixture: ComponentFixture<SavingsTypeDepositTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingsTypeDepositTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingsTypeDepositTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
