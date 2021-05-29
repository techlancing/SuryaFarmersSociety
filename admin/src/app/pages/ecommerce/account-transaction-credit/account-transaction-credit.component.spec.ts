import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransactionCreditComponent } from './account-transaction-credit.component';

describe('AccountTransactionCreditComponent', () => {
  let component: AccountTransactionCreditComponent;
  let fixture: ComponentFixture<AccountTransactionCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTransactionCreditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransactionCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
