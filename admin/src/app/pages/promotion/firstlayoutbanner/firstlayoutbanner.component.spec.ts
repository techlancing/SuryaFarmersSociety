import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstlayoutbannerComponent } from './firstlayoutbanner.component';

describe('FirstlayoutbannerComponent', () => {
  let component: FirstlayoutbannerComponent;
  let fixture: ComponentFixture<FirstlayoutbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstlayoutbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstlayoutbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
