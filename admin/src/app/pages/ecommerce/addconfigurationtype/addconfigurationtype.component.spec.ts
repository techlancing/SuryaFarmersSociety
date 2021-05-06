import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddconfigurationtypeComponent } from './addconfigurationtype.component';

describe('AddconfigurationtypeComponent', () => {
  let component: AddconfigurationtypeComponent;
  let fixture: ComponentFixture<AddconfigurationtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddconfigurationtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddconfigurationtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
