import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {NgxDateBarChartModule} from "../../../ngx-date-bar-chart/src/lib/ngx-date-bar-chart.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxDateBarChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
