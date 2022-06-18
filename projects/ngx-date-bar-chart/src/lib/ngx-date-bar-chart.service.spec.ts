import { TestBed } from '@angular/core/testing';

import { NgxDateBarChartService } from './ngx-date-bar-chart.service';

describe('NgxDateBarChartService', () => {
  let service: NgxDateBarChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDateBarChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
