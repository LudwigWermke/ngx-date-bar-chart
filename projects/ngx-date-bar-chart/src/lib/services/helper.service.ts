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
      1.2 * processedData[processedData.length - 1].value,
    ];
  }

  public getBarWidth(
    chartWidth: number,
    spacingPercentage: number,
    daysDiff: number
  ): number {
    return ((1 - spacingPercentage) * chartWidth) / daysDiff;
  }

  public daysDiff(xDomain: [Date, Date]): number {
    const start = xDomain[0];
    const end = xDomain[1];
    return (end.getTime() - start.getTime()) / 24 / 3600 / 1000;
  }
}
