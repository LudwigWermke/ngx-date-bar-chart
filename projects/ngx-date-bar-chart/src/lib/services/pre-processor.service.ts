import { Injectable } from '@angular/core';
import { INgxDateValue } from '../interfaces/date-value.interface';

@Injectable({
  providedIn: 'root',
})
export class PreProcessorService {
  constructor() {}

  public preProcess(data: INgxDateValue[]): INgxDateValue[] {
    const processedData = data.map((entry) => {
      const date = entry.date;
      date.setHours(0, 0, 0, 0);
      return {
        date,
        value: entry.value,
      };
    });

    return processedData;
  }
}
