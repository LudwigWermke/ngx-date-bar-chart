import { Component } from '@angular/core';
import { INgxDateValue } from 'projects/ngx-date-bar-chart/src/lib/interfaces/date-value.interface';
import { NgxDateBarChartComponent } from '../../../ngx-date-bar-chart/src/lib/ngx-date-bar-chart.component';
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
  // public data: INgxDateValue[] = [];

  constructor() {
    const data: INgxDateValueSeries[] = [];
    // const data: INgxDateValue[] = [];
    for (let i = 0; i < 10; ++i) {
      const date = new Date();
      date.setDate(new Date().getDate() + i);

      data.push({
        date,
        values: [i * i, ((i * i) / 4) * 3, i * i],
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

  // // Todo write example in doc
  // public formatDate(date: Date): string {
  //   return new Date(date).getDay().toString();
  // }
}
