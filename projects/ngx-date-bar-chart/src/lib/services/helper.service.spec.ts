import { TestBed } from '@angular/core/testing';
import { INgxDateValue } from '../interfaces/date-value.interface';

import { HelperService } from './helper.service';
import { INgxDateValueSeries } from '../interfaces/date-value-series.interface';

describe('HelperService', () => {
  let service: HelperService;
  let demoDataSingle: INgxDateValue[] = [];
  let demoDataSeries: INgxDateValueSeries[] = [];
  const manualXMin = new Date('07/07/2020, 09:15:33');
  const manualXMax = new Date('07/08/3022, 09:15:33');

  for (let i = 0; i < 10; ++i) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    demoDataSingle.push({ date, value: 100 - i });
    demoDataSeries.push({ date, values: [i + 5, 10, 100 - i] });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelperService);
    demoDataSingle = service.preProcessorService.preProcess(demoDataSingle);
    demoDataSeries =
      service.preProcessorService.preProcessSeries(demoDataSeries);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw an error, if there is to few data', () => {
    expect(() => service.getXDomain([], manualXMin, manualXMin)).toThrowError(
      'needs at least one value to properly set up chart.'
    );
  });

  it('should return the correct x domains', () => {
    let xDomain = service.getXDomain(demoDataSingle, undefined, undefined);
    let min = service.preProcessorService.toStartOfDay(demoDataSingle[0].date);
    let max = service.preProcessorService.toStartOfDay(
      demoDataSingle[demoDataSingle.length - 1].date
    );
    expect(xDomain[0].getTime()).toEqual(min.getTime() - 12 * 3600 * 1000);
    expect(xDomain[1].getTime()).toEqual(max.getTime() + 12 * 3600 * 1000);

    // same for series
    xDomain = service.getXDomain(demoDataSeries, undefined, undefined);
    expect(xDomain[0].getTime()).toEqual(min.getTime() - 12 * 3600 * 1000);
    expect(xDomain[1].getTime()).toEqual(max.getTime() + 12 * 3600 * 1000);
  });

  it('should retruns the correct manual min/max for x values and throw errors, if not working', () => {
    let xDomain = service.getXDomain(demoDataSingle, manualXMin, undefined);

    let min = service.preProcessorService.toStartOfDay(demoDataSingle[0].date);
    let max = service.preProcessorService.toStartOfDay(
      demoDataSingle[demoDataSingle.length - 1].date
    );

    expect(xDomain[0].getTime()).toEqual(
      service.preProcessorService.toStartOfDay(manualXMin).getTime() -
        12 * 3600 * 1000
    );
    expect(xDomain[1].getTime()).toEqual(max.getTime() + 12 * 3600 * 1000);

    xDomain = service.getXDomain(demoDataSingle, undefined, manualXMax);
    expect(xDomain[0].getTime()).toEqual(min.getTime() - 12 * 3600 * 1000);
    expect(xDomain[1].getTime()).toEqual(
      service.preProcessorService.toStartOfDay(manualXMax).getTime() +
        12 * 3600 * 1000
    );

    xDomain = service.getXDomain(demoDataSingle, manualXMin, manualXMax);
    expect(xDomain[0].getTime()).toEqual(
      service.preProcessorService.toStartOfDay(manualXMin).getTime() -
        12 * 3600 * 1000
    );
    expect(xDomain[1].getTime()).toEqual(
      service.preProcessorService.toStartOfDay(manualXMax).getTime() +
        12 * 3600 * 1000
    );

    expect(() =>
      service.getXDomain(demoDataSingle, manualXMin, manualXMin)
    ).toThrowError('min x-value must be at least one day before max');
  });

  it('should return the correct y domains', () => {
    let yDomain = service.getYDomain(
      demoDataSingle,
      undefined,
      undefined,
      false
    );

    expect(Math.abs(yDomain[0] - 91)).toBeLessThan(1e-10);
    expect(Math.abs(yDomain[1] - 110)).toBeLessThan(1e-10);

    yDomain = service.getYDomain(demoDataSingle, -10, 200, false);
    expect(Math.abs(yDomain[0] + 10)).toBeLessThan(1e-10);
    expect(Math.abs(yDomain[1] - 200)).toBeLessThan(1e-10);

    expect(() =>
      service.getYDomain(demoDataSingle, -10, -10, false)
    ).toThrowError(
      'max y value must at least be 1e-10 bigger than min y value'
    );
  });

  it('should return the correct y domains for stacked series', () => {
    let yDomain = service.getYDomain(
      demoDataSeries,
      undefined,
      undefined,
      false
    );

    expect(Math.abs(yDomain[0] - 5)).toBeLessThan(1e-10);
    expect(Math.abs(yDomain[1] - 110)).toBeLessThan(1e-10);

    yDomain = service.getYDomain(demoDataSeries, undefined, undefined, true);
    expect(Math.abs(yDomain[0])).toBeLessThan(1e-10);
    expect(Math.abs(yDomain[1] - 1.1 * 115)).toBeLessThan(1e-10);
  });
});
