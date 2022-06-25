import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'ngx-date-bar-chart',
  templateUrl: './ngx-date-bar-chart.component.html',
  styleUrls: ['./ngx-date-bar-chart.component.css']
})
export class NgxDateBarChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log(d3.scaleLinear([0, 100]));

  }

}
