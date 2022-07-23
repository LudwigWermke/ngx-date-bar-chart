import { Injectable } from '@angular/core';
import { INgxDateValue } from '../interfaces/date-value.interface';
import { INgxDateValueSeries } from '../interfaces/date-value-series.interface';

@Injectable({
  providedIn: 'root',
})
export class PreProcessorService {
  constructor() {}

  public preProcess(data: INgxDateValue[]): INgxDateValue[] {
    if (!data?.length) {
      throw new RangeError(
        'ngx-date-bar-chart needs at least one entry as an input'
      );
    }
    const processedData = data.map((entry) => ({
      date: this.toStartOfDay(entry.date),
      value: entry.value,
    }));

    processedData.sort((a, b) => a.date.getTime() - b.date.getTime());
    // filter
    return processedData.filter((d, index) => {
      const firstIndex = processedData.findIndex(
        (c) => c.date.getTime() === d.date.getTime()
      );
      return firstIndex === index;
    });
  }

  public preProcessSeries(data: INgxDateValueSeries[]): INgxDateValueSeries[] {
    if (!data?.length) {
      throw new RangeError(
        'ngx-date-bar-chart needs at least one entry as an input'
      );
    }
    const processedData = data.map((entry) => ({
      date: this.toStartOfDay(entry.date),
      values: entry.values,
    }));

    processedData.sort((a, b) => a.date.getTime() - b.date.getTime());
    // filter
    return processedData.filter((d, index) => {
      const firstIndex = processedData.findIndex(
        (c) => c.date.getTime() === d.date.getTime()
      );
      return firstIndex === index;
    });
  }

  public toStartOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }
}
