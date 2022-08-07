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
    demoDataSeries.push({ date, values: [i, 10, 100 - i] });
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
});
