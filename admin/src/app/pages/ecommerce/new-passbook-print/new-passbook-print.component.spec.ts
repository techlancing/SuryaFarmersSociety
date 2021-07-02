import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPassbookPrintComponent } from './new-passbook-print.component';

describe('NewPassbookPrintComponent', () => {
  let component: NewPassbookPrintComponent;
  let fixture: ComponentFixture<NewPassbookPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPassbookPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPassbookPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
