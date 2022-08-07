import { TestBed } from '@angular/core/testing';
import { INgxDateValue } from '../interfaces/date-value.interface';

import { PreProcessorService } from './pre-processor.service';
import { INgxDateValueSeries } from '../interfaces/date-value-series.interface';

describe('PreProcessorService', () => {
  let service: PreProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the time to the start of the day and not modify the param', () => {
    const date = new Date('07/08/2022, 09:15:33');
    const toStart = service.toStartOfDay(date);
    expect(toStart.getDate()).toEqual(date.getDate());
    expect(toStart.getHours()).toEqual(0);
    expect(date.getHours()).toEqual(9);
  });

  it('should throw a range error for no data', () => {
    expect(() => service.preProcess([])).toThrowError(
      'ngx-date-bar-chart needs at least one entry as an input'
    );
  });

  it('should throw a range error for no data', () => {
    expect(() => service.preProcessSeries([])).toThrowError(
      'ngx-date-bar-chart needs at least one entry as an input'
    );
  });

  it('should sort the entries and remove double entries', () => {
    const data: INgxDateValue[] = [];
    for (let i = 0; i < 3; ++i) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({ date, value: 0 });
    }
    data.push({ date: new Date(), value: 0 });

    const processed = service.preProcess(data);
    expect(processed.length).toEqual(3);
    expect(processed[0].date.getTime()).toBeLessThan(
      processed[1].date.getTime()
    );
  });

  it('should sort the entries and remove double entries', () => {
    const data: INgxDateValueSeries[] = [];
    for (let i = 0; i < 3; ++i) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({ date, values: [0, 1] });
    }
    data.push({ date: new Date(), values: [0, 1] });

    const processed = service.preProcessSeries(data);
    expect(processed.length).toEqual(3);
    expect(processed[0].date.getTime()).toBeLessThan(
      processed[1].date.getTime()
    );
  });
});
