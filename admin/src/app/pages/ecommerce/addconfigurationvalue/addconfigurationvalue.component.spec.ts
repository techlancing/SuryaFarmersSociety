import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddconfigurationvalueComponent } from './addconfigurationvalue.component';

describe('AddconfigurationvalueComponent', () => {
  let component: AddconfigurationvalueComponent;
  let fixture: ComponentFixture<AddconfigurationvalueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddconfigurationvalueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddconfigurationvalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
