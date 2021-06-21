import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntraTransactionComponent } from './intra-transaction.component';

describe('IntraTransactionComponent', () => {
  let component: IntraTransactionComponent;
  let fixture: ComponentFixture<IntraTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntraTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntraTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
