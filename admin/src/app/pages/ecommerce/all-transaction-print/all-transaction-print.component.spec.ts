import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTransactionPrintComponent } from './all-transaction-print.component';

describe('AllTransactionPrintComponent', () => {
  let component: AllTransactionPrintComponent;
  let fixture: ComponentFixture<AllTransactionPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTransactionPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTransactionPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
