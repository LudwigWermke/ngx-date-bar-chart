import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import {INgxDateValue} from './interfaces/date-value.interface';
import {HelperService} from './services/helper.service';

@Component({
  selector: 'ngx-date-bar-chart',
  templateUrl: './ngx-date-bar-chart.component.html',
  styleUrls: ['./ngx-date-bar-chart.component.css']
})
export class NgxDateBarChartComponent implements OnInit {
  @Input() set data(data: INgxDateValue[]) {
    // TODO: preprocess etc, abort if no data
    this.processedData = data;
    this.xDomain = this.helperService.getXDomain(this.processedData);
    this.yDomain = this.helperService.getYDomain(this.processedData);
  }

  public transformXAxis = '';
  public transformYAxis = '';

  public processedData: INgxDateValue[] = [];

  public xDomain: [Date, Date] = [new Date(), new Date()];
  public yDomain: [number, number] = [0, 100];


  public fullWidth = 800;
  public fullHeight = 400;
  public chartHeight = 800;
  public chartWidth = 400;

  public margin = {top: 0, left: 20, right: 0, bottom: 30};

  constructor(private helperService: HelperService) { }

  ngOnInit(): void {
    this.onResize();
  }

  // mock method
  private onResize() {
    this.chartHeight = this.fullHeight - this.margin.top - this.margin.bottom;
    this.chartWidth = this.fullWidth - this.margin.left - this.margin.right;

    // translates axis to left and bottom
    this.transformXAxis = `translate(${this.margin.left},${this.chartHeight + this.margin.top})`;
    this.transformYAxis = `translate(${this.margin.left},${this.margin.top})`;
  }
}
