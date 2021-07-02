import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPrintLineComponent } from './select-print-line.component';

describe('SelectPrintLineComponent', () => {
  let component: SelectPrintLineComponent;
  let fixture: ComponentFixture<SelectPrintLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPrintLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPrintLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
