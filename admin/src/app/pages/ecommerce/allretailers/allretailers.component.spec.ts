import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllretailersComponent } from './allretailers.component';

describe('AllretailersComponent', () => {
  let component: AllretailersComponent;
  let fixture: ComponentFixture<AllretailersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllretailersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllretailersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
