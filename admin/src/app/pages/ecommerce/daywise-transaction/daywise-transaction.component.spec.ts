import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseTransactionComponent } from './daywise-transaction.component';

describe('DaywiseTransactionComponent', () => {
  let component: DaywiseTransactionComponent;
  let fixture: ComponentFixture<DaywiseTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaywiseTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaywiseTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
