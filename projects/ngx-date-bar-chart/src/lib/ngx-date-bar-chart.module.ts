import { NgModule } from '@angular/core';
import { NgxDateBarChartComponent } from './ngx-date-bar-chart.component';
import { SingleBarComponent } from './single-bar/single-bar.component';
import { StackedBarComponent } from './stacked-bar/stacked-bar.component';
import {SeriesBarComponent} from "./series-bar/series-bar.component";



@NgModule({
  declarations: [
    NgxDateBarChartComponent,
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
