import { NgModule } from '@angular/core';
import { NgxDateBarChartComponent } from './ngx-date-bar-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { SingleBarComponent } from './bar-chart/single-bar/single-bar.component';
import { StackedBarComponent } from './bar-chart/stacked-bar/stacked-bar.component';
import { SeriesBarComponent } from './bar-chart/series-bar/series-bar.component';



@NgModule({
  declarations: [
    NgxDateBarChartComponent,
    BarChartComponent,
    SingleBarComponent,
    StackedBarComponent,
    SeriesBarComponent
  ],
  imports: [
  ],
  exports: [
    NgxDateBarChartComponent
  ]
})
export class NgxDateBarChartModule { }
