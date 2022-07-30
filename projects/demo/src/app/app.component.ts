import { Component, QueryList, ViewChildren } from '@angular/core';
import { INgxDateValue } from 'projects/ngx-date-bar-chart/src/lib/interfaces/date-value.interface';
import { INgxDateValueSeries } from '../../../ngx-date-bar-chart/src/lib/interfaces/date-value-series.interface';
import { NgxDateBarChartComponent } from '../../../ngx-date-bar-chart/src/lib/ngx-date-bar-chart.component';
import { LegendPosition } from 'projects/ngx-date-bar-chart/src/lib/enums/legend-position.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /**
   * use this to manually trigger resizing a component
   * if you have to (resizing gets triggered  only on window:resize())
   * and just call 'resize()' for each child/chart e.g.
   * `this.children.forEach((c) => c.resize());`
   */
  @ViewChildren(NgxDateBarChartComponent)
  children!: QueryList<NgxDateBarChartComponent>;

  public basicData: INgxDateValue[] = [];
  public basicSeriesData: INgxDateValueSeries[] = [];

  public LegendPosition = LegendPosition;

  constructor() {
    this.initBasicData();
    this.initBasicSeriesData();
  }

  public barRadiusFunction(barWidth: number): number {
    return barWidth / 6;
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
      data.push({ date, values: [50 + 5 + i * i, 60 + i * i, 5 * i + 30] });
    }
    this.basicSeriesData = data;
  }

  public formatDate(date: Date): string {
    const options: any = { month: '2-digit', day: '2-digit', year: '2-digit' };
    return date.toLocaleDateString('de-DE', options);
  }
}
