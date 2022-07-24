import { TestBed } from '@angular/core/testing';

import { PreProcessorService } from './pre-processor.service';

describe('PreProcessorService', () => {
  let service: PreProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
