import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupForEmployeeComponent } from './signup-for-employee.component';

describe('SignupForEmployeeComponent', () => {
  let component: SignupForEmployeeComponent;
  let fixture: ComponentFixture<SignupForEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupForEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupForEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
