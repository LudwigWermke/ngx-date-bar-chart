import { Injectable } from '@angular/core';
import { INgxDateValue } from '../interfaces/date-value.interface';

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
    const processedData = data.map((entry) => {
      const date = entry.date;
      date.setHours(0, 0, 0, 0);
      return {
        date,
        value: entry.value,
      };
    });

    processedData.sort((a, b) => a.date.getTime() - b.date.getTime());

    // filter
    return processedData.filter((d, index) => {
      const firstIndex = data.findIndex(
        (c) => c.date.getTime() === d.date.getTime()
      );
      return firstIndex === index;
    });
  }
}
