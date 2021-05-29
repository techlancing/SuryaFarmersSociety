import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransactionDailysavingdebitComponent } from './account-transaction-dailysavingdebit.component';

describe('AccountTransactionDailysavingdebitComponent', () => {
  let component: AccountTransactionDailysavingdebitComponent;
  let fixture: ComponentFixture<AccountTransactionDailysavingdebitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTransactionDailysavingdebitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransactionDailysavingdebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
