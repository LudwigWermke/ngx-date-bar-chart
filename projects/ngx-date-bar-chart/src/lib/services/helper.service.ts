import { Injectable } from '@angular/core';
import { INgxDateValue } from '../interfaces/date-value.interface';
import { PreProcessorService } from './pre-processor.service';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private preProcessorService: PreProcessorService) {}

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

    const min = Math.min(...processedData.map((c) => c.value));
    const max = Math.max(...processedData.map((c) => c.value));

    return [min, 1.1 * max];
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

  public createTicksBasedOnWidth(
    width: number,
    xDomain: [Date, Date],
    minSpacePerXTick: number
  ): Date[] {
    const daysDiff = this.daysDiff(xDomain);
    const calculatedStepSize = Math.ceil(
      1 / (width / daysDiff / minSpacePerXTick)
    );
    const stepSize = Math.max(calculatedStepSize, 1);

    const dates: Date[] = [];

    for (let i = 1; i <= daysDiff; i += stepSize) {
      const start = this.preProcessorService.toStartOfDay(xDomain[0]);
      start.setDate(start.getDate() + i);
      dates.push(start);
    }
    return dates;
  }
}
