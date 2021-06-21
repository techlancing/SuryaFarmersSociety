import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseCumulativeComponent } from './daywise-cumulative.component';

describe('DaywiseCumulativeComponent', () => {
  let component: DaywiseCumulativeComponent;
  let fixture: ComponentFixture<DaywiseCumulativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaywiseCumulativeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaywiseCumulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
