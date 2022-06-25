import { Injectable } from '@angular/core';
import { INgxDateValue } from '../interfaces/date-value.interface';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}

  public getXDomain(processedData: INgxDateValue[]): [Date, Date] {
    if (!processedData?.length) {
      throw new RangeError(
        'needs at least one value to properly set up chart.'
      );
    }

    const min = new Date(processedData[0].date);
    min.setTime(min.getTime() - 12 * 3600 * 1000);

    const max = new Date(processedData[processedData.length - 1].date);
    max.setTime(max.getTime() + 12 * 3600 * 1000);
    return [min, max];
  }

  public getYDomain(processedData: INgxDateValue[]): [number, number] {
    if (!processedData?.length) {
      throw new RangeError(
        'needs at least one value to properly set up chart.'
      );
    }
    return [
      processedData[0].value,
      processedData[processedData.length - 1].value,
    ];
  }
}
