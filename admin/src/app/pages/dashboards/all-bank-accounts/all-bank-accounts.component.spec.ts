import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBankAccountsComponent } from './all-bank-accounts.component';

describe('AllBankAccountsComponent', () => {
  let component: AllBankAccountsComponent;
  let fixture: ComponentFixture<AllBankAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllBankAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBankAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
