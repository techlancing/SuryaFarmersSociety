import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedAccountLedgerTableComponent } from './closed-account-ledger-table.component';

describe('ClosedAccountLedgerTableComponent', () => {
  let component: ClosedAccountLedgerTableComponent;
  let fixture: ComponentFixture<ClosedAccountLedgerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedAccountLedgerTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedAccountLedgerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
