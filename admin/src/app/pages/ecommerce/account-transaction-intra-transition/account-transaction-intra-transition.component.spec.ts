import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransactionIntraTransitionComponent } from './account-transaction-intra-transition.component';

describe('AccountTransactionIntraTransitionComponent', () => {
  let component: AccountTransactionIntraTransitionComponent;
  let fixture: ComponentFixture<AccountTransactionIntraTransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTransactionIntraTransitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransactionIntraTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
