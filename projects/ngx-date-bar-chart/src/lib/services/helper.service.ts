import { Injectable } from '@angular/core';
import {INgxDateValue} from '../interfaces/date-value.interface';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  public getXDomain(processedData: INgxDateValue[]): [Date, Date] {
    if (!processedData?.length) {
      throw new RangeError('needs at least one value to properly set up chart.');
    }
    return [processedData[0].date, processedData[processedData.length-1].date];
  }

  public getYDomain(processedData: INgxDateValue[]): [number, number] {
    if (!processedData?.length) {
      throw new RangeError('needs at least one value to properly set up chart.');
    }
    return [processedData[0].value, processedData[processedData.length-1].value];
  }
}
