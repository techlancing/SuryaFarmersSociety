import { TestBed } from '@angular/core/testing';

import { NarrationstringService } from './narrationstring.service';

describe('NarrationstringService', () => {
  let service: NarrationstringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NarrationstringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
