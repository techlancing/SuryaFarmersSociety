import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Last12MonthsTransactionComponent } from './last12-months-transaction.component';

describe('Last12MonthsTransactionComponent', () => {
  let component: Last12MonthsTransactionComponent;
  let fixture: ComponentFixture<Last12MonthsTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Last12MonthsTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Last12MonthsTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
