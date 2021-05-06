import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicedetailsComponent } from './invoicedetails.component';

describe('InvoicedetailsComponent', () => {
  let component: InvoicedetailsComponent;
  let fixture: ComponentFixture<InvoicedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
