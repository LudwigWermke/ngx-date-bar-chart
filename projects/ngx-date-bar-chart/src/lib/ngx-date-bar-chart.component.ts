import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import {INgxDateValue} from './interfaces/date-value.interface';

@Component({
  selector: 'ngx-date-bar-chart',
  templateUrl: './ngx-date-bar-chart.component.html',
  styleUrls: ['./ngx-date-bar-chart.component.css']
})
export class NgxDateBarChartComponent implements OnInit {
  @Input() set data(data: INgxDateValue[]) {
    // TODO: preprocess etc
    this.processedData = data;
  }

  public processedData: INgxDateValue[] = [];

  constructor() { }

  ngOnInit(): void {
    console.log(d3.scaleLinear([0, 100]));

  }

}
