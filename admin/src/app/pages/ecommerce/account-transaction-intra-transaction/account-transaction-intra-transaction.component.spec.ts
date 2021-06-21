import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransactionIntraTransactionComponent } from './account-transaction-intra-transaction.component';

describe('AccountTransactionIntraTransactionComponent', () => {
  let component: AccountTransactionIntraTransactionComponent;
  let fixture: ComponentFixture<AccountTransactionIntraTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTransactionIntraTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransactionIntraTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
