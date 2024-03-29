import { Component, QueryList, ViewChildren } from '@angular/core';
import { INgxDateValue } from '../../../ngx-date-bar-chart/src/lib/interfaces/date-value.interface';
import { INgxDateValueSeries } from '../../../ngx-date-bar-chart/src/lib/interfaces/date-value-series.interface';
import { NgxDateBarChartComponent } from '../../../ngx-date-bar-chart/src/lib/ngx-date-bar-chart.component';
import { LegendPosition } from '../../../ngx-date-bar-chart/src/lib/enums/legend-position.enum';

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
    for (let i = 0; i < 11; ++i) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      data.push({ date, value: Math.random() * 100 + 50 });
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

  public customDrawing = (
    boundingSvgSelection: any,

    fullWidth: number,
    fullHeight: number,
    chartHeight: number,
    chartWidth: number,
    barWidth: number,
    padding: { top: number; left: number; right: number; bottom: number },

    xScale: any,
    yScale: any,

    dataSingle: INgxDateValue[],
    dataSeries: INgxDateValueSeries[],
    xDomain: [Date, Date],
    yDomain: [number, number]
  ) => {
    // lazy removal of all stuff (so it won't get rendered twice, there are better ways,
    // but for the demo it's fine
    boundingSvgSelection
      .selectAll('.custom-after-rendering')
      .selectAll('line')
      .remove();

    /*
     *  append a red line
     *  use the other g containers to render the line on the level you want
     *  'custom-before-rendering'
     *  'custom-between-bar-and-axis'
     *  'custom-after-rendering'
     */
    boundingSvgSelection
      .selectAll('.custom-after-rendering')
      .append('line')
      .style('stroke', 'red')
      .style('stroke-width', 3)
      .attr('x1', padding.left)
      .attr('y1', padding.top)
      .attr(
        'x2',
        padding.left +
          xScale(dataSingle[Math.floor(dataSingle.length / 2)].date)
      )
      .attr(
        'y2',
        padding.top +
          yScale(dataSingle[Math.floor(dataSingle.length / 2)].value)
      );
  };
}
