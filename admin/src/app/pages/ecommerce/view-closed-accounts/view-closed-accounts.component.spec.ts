import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClosedAccountsComponent } from './view-closed-accounts.component';

describe('ViewClosedAccountsComponent', () => {
  let component: ViewClosedAccountsComponent;
  let fixture: ComponentFixture<ViewClosedAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewClosedAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClosedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
