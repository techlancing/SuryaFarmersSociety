import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountDataComponent } from './bank-account-data.component';

describe('BankAccountDataComponent', () => {
  let component: BankAccountDataComponent;
  let fixture: ComponentFixture<BankAccountDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
