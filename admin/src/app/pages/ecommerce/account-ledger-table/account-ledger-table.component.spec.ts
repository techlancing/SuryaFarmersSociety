import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLedgerTableComponent } from './account-ledger-table.component';

describe('AccountLedgerTableComponent', () => {
  let component: AccountLedgerTableComponent;
  let fixture: ComponentFixture<AccountLedgerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountLedgerTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLedgerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
