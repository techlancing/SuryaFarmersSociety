import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomemainbannerComponent } from './homemainbanner.component';

describe('HomemainbannerComponent', () => {
  let component: HomemainbannerComponent;
  let fixture: ComponentFixture<HomemainbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomemainbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomemainbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
