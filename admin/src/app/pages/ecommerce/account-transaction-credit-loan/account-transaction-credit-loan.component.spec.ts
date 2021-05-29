import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransactionCreditLoanComponent } from './account-transaction-credit-loan.component';

describe('AccountTransactionCreditLoanComponent', () => {
  let component: AccountTransactionCreditLoanComponent;
  let fixture: ComponentFixture<AccountTransactionCreditLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTransactionCreditLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransactionCreditLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
