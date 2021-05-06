import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicetransactionComponent } from './invoicetransaction.component';

describe('InvoicetransactionComponent', () => {
  let component: InvoicetransactionComponent;
  let fixture: ComponentFixture<InvoicetransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicetransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicetransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
