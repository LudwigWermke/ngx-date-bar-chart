import { Component } from '@angular/core';
import { INgxDateValue } from 'projects/ngx-date-bar-chart/src/lib/interfaces/date-value.interface';
import { INgxDateValueSeries } from '../../../ngx-date-bar-chart/src/lib/interfaces/date-value-series.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // // TODO: api ref
  // @ViewChildren(NgxDateBarChartComponent)
  // children!: QueryList<NgxDateBarChartComponent>;

  public data: INgxDateValueSeries[] = [];
  public basicData: INgxDateValue[] = [];
  public basicSeriesData: INgxDateValueSeries[] = [];

  constructor() {
    this.initBasicData();
    this.initBasicSeriesData();
    const data: INgxDateValueSeries[] = [];
    // const data: INgxDateValue[] = [];
    for (let i = 0; i < 10; ++i) {
      const date = new Date();
      date.setDate(new Date().getDate() + i);

      data.push({
        date,
        values: [i, i, 3 * i, 2 * i],
        // value: i * i,
      });
    }

    this.data = data;

    // TODO: include in docs
    // setTimeout(() => {
    //   this.children.forEach((c) => c.resize());
    // }, 5000);
  }

  public barRadiusFunction(barWidth: number): number {
    return barWidth / 3;
  }

  private initBasicData(): void {
    const data: INgxDateValue[] = [];
    for (let i = 0; i < 10; ++i) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      data.push({ date, value: 5 + i * i });
    }
    this.basicData = data;
  }

  private initBasicSeriesData(): void {
    const data: INgxDateValueSeries[] = [];
    for (let i = 0; i < 10; ++i) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      data.push({ date, values: [5 + i * i, 10 + i * i, 5 * i] });
    }
    this.basicSeriesData = data;
  }
}
