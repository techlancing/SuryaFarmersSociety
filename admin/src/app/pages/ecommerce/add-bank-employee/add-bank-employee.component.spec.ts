import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankEmployeeComponent } from './add-bank-employee.component';

describe('AddBankEmployeeComponent', () => {
  let component: AddBankEmployeeComponent;
  let fixture: ComponentFixture<AddBankEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
