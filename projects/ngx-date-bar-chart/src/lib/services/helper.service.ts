import { Injectable } from '@angular/core';
import { INgxDateValue } from '../interfaces/date-value.interface';
import { PreProcessorService } from './pre-processor.service';
import { INgxDateValueSeries } from '../interfaces/date-value-series.interface';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(public preProcessorService: PreProcessorService) {}

  // region: domains

  public getXDomain(
    processedData: INgxDateValue[] | INgxDateValueSeries[],
    manualXMin: Date | undefined,
    manualXMax: Date | undefined
  ): [Date, Date] {
    this.assertSomeData(processedData);
    const min = this.getXMin(processedData, manualXMin);
    const max = this.getXMax(processedData, manualXMax);

    // some padding left and right
    min.setTime(min.getTime() - 12 * 3600 * 1000);
    max.setTime(max.getTime() + 12 * 3600 * 1000);

    if (min.getTime() >= max.getTime() - 24 * 3600 * 1000) {
      throw new RangeError('min x-value must be at least one day before max');
    }

    return [min, max];
  }

  public getYDomain(
    processedData: INgxDateValue[] | INgxDateValueSeries[],
    manualYMin: number | undefined,
    manualYMax: number | undefined,
    stacked: boolean
  ): [number, number] {
    this.assertSomeData(processedData);

    const min = this.getYMin(processedData, manualYMin, stacked);
    const max = this.getYMax(processedData, manualYMax, stacked);

    if (max - min < 1e-10) {
      throw new RangeError(
        'max y value must at least be 1e-10 bigger than min y value'
      );
    }

    return [min, max];
  }

  // region bar-width, days Diff and x ticks

  public getBarWidth(
    chartWidth: number,
    spacingPercentage: number,
    xDomain: [Date, Date]
  ): number {
    const daysDiff = this.daysDiff(xDomain);
    return ((1 - spacingPercentage) * chartWidth) / daysDiff;
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

  // region: min/max

  private getXMin(
    processedData: INgxDateValue[] | INgxDateValueSeries[],
    manualXMin: Date | undefined
  ): Date {
    if (manualXMin !== undefined) {
      return this.preProcessorService.toStartOfDay(manualXMin);
    }
    return new Date(processedData[0].date);
  }

  private getXMax(
    processedData: INgxDateValue[] | INgxDateValueSeries[],
    manualXMax: Date | undefined
  ): Date {
    if (manualXMax !== undefined) {
      return this.preProcessorService.toStartOfDay(manualXMax);
    }
    return new Date(processedData[processedData.length - 1].date);
  }

  private isSeries(
    data: INgxDateValue[] | INgxDateValueSeries[]
  ): data is INgxDateValueSeries[] {
    return (data as INgxDateValueSeries[])[0].values !== undefined;
  }

  private getYMin(
    data: INgxDateValue[] | INgxDateValueSeries[],
    manualYMin: number | undefined,
    stacked: boolean
  ): number {
    if (stacked) {
      return 0;
    }

    if (manualYMin !== undefined) {
      return manualYMin;
    }

    if (!this.isSeries(data)) {
      if (data.length === 1) {
        return data[0].value - 10;
      }
      return Math.min(...data.map((c) => c.value));
    }

    return Math.min(...data.map((d) => Math.min(...d.values)));
  }

  private getYMax(
    data: INgxDateValue[] | INgxDateValueSeries[],
    manualYMax: number | undefined,
    stacked: boolean
  ) {
    if (manualYMax !== undefined) {
      return manualYMax;
    }

    if (!this.isSeries(data)) {
      if (data.length === 1) {
        return data[0].value + 5;
      }
      return 1.1 * Math.max(...data.map((c) => c.value));
    }

    return (
      1.1 *
      Math.max(
        ...data.map((d) =>
          stacked ? this.sumPerDay(d) : Math.max(...d.values)
        )
      )
    );
  }

  // region: small helper functions

  public sumPerDay(entry: INgxDateValueSeries): number {
    let sum = 0;
    for (const value of entry.values) {
      sum += value;
    }
    return sum;
  }

  public assertSomeData(
    processedData: INgxDateValue[] | INgxDateValueSeries[]
  ): void {
    if (!processedData?.length) {
      throw new RangeError(
        'needs at least one value to properly set up chart.'
      );
    }
  }

  public daysDiff(xDomain: [Date, Date]): number {
    const start = xDomain[0];
    const end = xDomain[1];
    return (end.getTime() - start.getTime()) / 24 / 3600 / 1000;
  }
}
