import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBalanceEnquiryComponent } from './account-balance-enquiry.component';

describe('AccountBalanceEnquiryComponent', () => {
  let component: AccountBalanceEnquiryComponent;
  let fixture: ComponentFixture<AccountBalanceEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountBalanceEnquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBalanceEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
