import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransactionDebitComponent } from './account-transaction-debit.component';

describe('AccountTransactionDebitComponent', () => {
  let component: AccountTransactionDebitComponent;
  let fixture: ComponentFixture<AccountTransactionDebitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTransactionDebitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransactionDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
