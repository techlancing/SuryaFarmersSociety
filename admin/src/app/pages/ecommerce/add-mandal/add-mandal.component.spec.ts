import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMandalComponent } from './add-mandal.component';

describe('AddMandalComponent', () => {
  let component: AddMandalComponent;
  let fixture: ComponentFixture<AddMandalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMandalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMandalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
