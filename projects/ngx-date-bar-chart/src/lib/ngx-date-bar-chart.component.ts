import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { INgxDateValue } from './interfaces/date-value.interface';
import { HelperService } from './services/helper.service';
import {AxisDomain} from 'd3';

@Component({
  selector: 'ngx-date-bar-chart',
  templateUrl: './ngx-date-bar-chart.component.html',
  styleUrls: ['./ngx-date-bar-chart.component.css'],
})
export class NgxDateBarChartComponent implements OnInit {
  @Input() set data(data: INgxDateValue[]) {
    // TODO: preprocess etc, abort if no data
    this.processedData = data;
    this.xDomain = this.helperService.getXDomain(this.processedData);
    this.yDomain = this.helperService.getYDomain(this.processedData);
    setTimeout(() => this.redraw());
  }

  public transformXAxis = '';
  public transformYAxis = '';

  public processedData: INgxDateValue[] = [];

  public xDomain: [Date, Date] = [new Date(), new Date()];
  public yDomain: [number, number] = [0, 100];

  public xScale: any;
  public yScale: any;

  public fullWidth = 800;
  public fullHeight = 400;
  public chartHeight = 800;
  public chartWidth = 400;

  public internalId = `ngx-date-bar-chart${Math.round(Math.random() * 1000000)}`;

  public margin = { top: 0, left: 30, right: 0, bottom: 20 };

  constructor(private helperService: HelperService) {
  }

  ngOnInit(): void {
    this.calculateDimension();
  }

  private redraw(): void {
    this.calculateDimension();
    this.initScales();
    this.drawAxis();
  }

  // mock method
  private calculateDimension() {
    this.chartHeight = this.fullHeight - this.margin.top - this.margin.bottom;
    this.chartWidth = this.fullWidth - this.margin.left - this.margin.right;

    // translates axis to left and bottom
    this.transformXAxis = `translate(${this.margin.left},${
      this.chartHeight + this.margin.top
    })`;
    this.transformYAxis = `translate(${this.margin.left},${this.margin.top})`;
  }

  private initScales(): void {
    this.xScale = d3
      .scaleTime()
      .domain(this.xDomain)
      .range([0, this.chartWidth])
      .clamp(true);

    this.yScale = d3
      .scaleLinear()
      .domain(this.yDomain)
      .range([this.chartHeight, 0])
      .clamp(true);
  }

  private drawAxis(): void {
    if (!this.xScale || !this.yScale) {
      return;
    }

    const xAxis = d3
      .axisBottom(this.xScale)
      .ticks(d3.timeDay)
      .tickFormat((x: AxisDomain) => this.formatDate(x));

    const xAxisElement: any = this.selectChart().selectAll('g.x-axis');
    xAxisElement.call(xAxis);

    const yAxis = d3.axisLeft(this.yScale).tickSizeOuter(0);

    const yAxisElement: any = this.selectChart().selectAll('g.y-axis');

    yAxisElement.call(yAxis);
  }

  private formatDate(x: AxisDomain): string {
    const value = x.valueOf();
    const date = new Date(value);
    return `${date.getMonth()}-${date.getDate()}`;
  }

  private selectChart() {
    return d3.select(`#${this.internalId}`).select('svg');
  }
}
