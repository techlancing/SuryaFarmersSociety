import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassbookPrintComponent } from './passbook-print.component';

describe('PassbookPrintComponent', () => {
  let component: PassbookPrintComponent;
  let fixture: ComponentFixture<PassbookPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassbookPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassbookPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
