import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondlayoutbannerComponent } from './secondlayoutbanner.component';

describe('SecondlayoutbannerComponent', () => {
  let component: SecondlayoutbannerComponent;
  let fixture: ComponentFixture<SecondlayoutbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondlayoutbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondlayoutbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
