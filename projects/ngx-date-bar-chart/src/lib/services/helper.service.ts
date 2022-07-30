import { Injectable } from '@angular/core';
import { INgxDateValue } from '../interfaces/date-value.interface';
import { PreProcessorService } from './pre-processor.service';
import { INgxDateValueSeries } from '../interfaces/date-value-series.interface';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private preProcessorService: PreProcessorService) {}

  public getXDomain(
    processedData: INgxDateValue[] | INgxDateValueSeries[],
    manualXMin: Date | undefined,
    manualXMax: Date | undefined
  ): [Date, Date] {
    if (!processedData?.length) {
      throw new RangeError(
        'needs at least one value to properly set up chart.'
      );
    }

    const min = this.getXMin(processedData, manualXMin);
    const max = this.getXMax(processedData, manualXMax);

    min.setTime(min.getTime() - 12 * 3600 * 1000);
    max.setTime(max.getTime() + 12 * 3600 * 1000);

    return [min, max];
  }

  private getXMin(
    processedData: INgxDateValue[] | INgxDateValueSeries[],
    manualXMin: Date | undefined
  ): Date {
    if (manualXMin !== undefined) {
      return new Date(manualXMin);
    }
    return new Date(processedData[0].date);
  }

  private getXMax(
    processedData: INgxDateValue[] | INgxDateValueSeries[],
    manualXMax: Date | undefined
  ): Date {
    if (manualXMax !== undefined) {
      return new Date(manualXMax);
    }
    return new Date(processedData[processedData.length - 1].date);
  }

  private getMin(
    data: INgxDateValue[],
    manualYMin: number | undefined
  ): number {
    if (manualYMin !== undefined) {
      return manualYMin;
    }

    if (data.length === 1) {
      return data[0].value - 10;
    }
    return Math.min(...data.map((c) => c.value));
  }

  public getYDomain(
    processedData: INgxDateValue[],
    manualYMin: number | undefined,
    manualYMax: number | undefined
  ): [number, number] {
    if (!processedData?.length) {
      throw new RangeError(
        'needs at least one value to properly set up chart.'
      );
    }

    return [
      this.getMin(processedData, manualYMin),
      this.getMax(processedData, manualYMax),
    ];
  }

  private sum(entry: INgxDateValueSeries): number {
    let sum = 0;
    for (const value of entry.values) {
      sum += value;
    }
    return sum;
  }

  public getYDomainSeries(
    processedData: INgxDateValueSeries[],
    stacked: boolean,
    manualYMin: number | undefined,
    manualYMax: number | undefined
  ): [number, number] {
    if (!processedData?.length) {
      throw new RangeError(
        'needs at least one value to properly set up chart.'
      );
    }

    const min = stacked
      ? 0
      : manualYMin !== undefined
      ? manualYMin
      : Math.min(
          ...processedData.map((d) => (stacked ? 0 : Math.min(...d.values)))
        );

    const max =
      manualYMax !== undefined
        ? manualYMax
        : 1.1 *
          Math.max(
            ...processedData.map((d) =>
              stacked ? this.sum(d) : Math.max(...d.values)
            )
          );

    return [min, max];
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

  private getMax(
    processedData: INgxDateValue[],
    manualYMax: number | undefined
  ) {
    if (manualYMax !== undefined) {
      return manualYMax;
    }
    if (processedData.length === 1) {
      return processedData[0].value + 5;
    }
    return 1.1 * Math.max(...processedData.map((c) => c.value));
  }
}
