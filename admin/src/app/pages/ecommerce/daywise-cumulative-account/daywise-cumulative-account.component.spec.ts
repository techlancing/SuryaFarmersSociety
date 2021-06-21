import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseCumulativeAccountComponent } from './daywise-cumulative-account.component';

describe('DaywiseCumulativeAccountComponent', () => {
  let component: DaywiseCumulativeAccountComponent;
  let fixture: ComponentFixture<DaywiseCumulativeAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaywiseCumulativeAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaywiseCumulativeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
