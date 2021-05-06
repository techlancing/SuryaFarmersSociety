import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdlayoutbannerComponent } from './thirdlayoutbanner.component';

describe('ThirdlayoutbannerComponent', () => {
  let component: ThirdlayoutbannerComponent;
  let fixture: ComponentFixture<ThirdlayoutbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdlayoutbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdlayoutbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
