import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsDisplayComponent } from './approvals-display.component';

describe('ApprovalsDisplayComponent', () => {
  let component: ApprovalsDisplayComponent;
  let fixture: ComponentFixture<ApprovalsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalsDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
