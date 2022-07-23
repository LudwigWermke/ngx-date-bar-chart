import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { INgxDateValue } from './interfaces/date-value.interface';
import { HelperService } from './services/helper.service';
import { AxisDomain } from 'd3';
import { PreProcessorService } from './services/pre-processor.service';
import { INgxDateValueSeries } from './interfaces/date-value-series.interface';

@Component({
  selector: 'ngx-date-bar-chart',
  templateUrl: './ngx-date-bar-chart.component.html',
  styleUrls: ['./ngx-date-bar-chart.component.css'],
})
export class NgxDateBarChartComponent implements OnInit {
  @Input() set data(data: INgxDateValue[] | INgxDateValueSeries[]) {
    if (data.length === 0) {
      return;
    }

    // single bar chart
    if ('value' in data[0]) {
      this.processedData = this.preProcessorService.preProcess(
        data as INgxDateValue[]
      );
    } else {
      this.processedDataSeries = this.preProcessorService.preProcessSeries(
        data as INgxDateValueSeries[]
      );
    }
    this.calcDomainsAndResize();
  }

  @Input() formatDateFunction: ((date: Date) => string) | undefined;

  @Input() fixedXTicks: Date[] | undefined;
  @Input() fixedYTicks: number[] | undefined;

  @Input() rounded = true;
  @Input() barRadiusFunction: ((barWidth: number) => number) | undefined;

  @Input() colors: string[] = ['#6bc5c4'];

  @Input() minSpacePerXTick = 60;

  @Input() set xAxisHeight(height: number) {
    if (height < 0 || height >= this.fullHeight) {
      return;
    }
    this.padding.bottom = height;
  }

  @Input() set yAxisWidth(width: number) {
    if (width < 0 || width >= this.fullHeight) {
      return;
    }
    this.padding.left = width;
  }

  @Input() barSpacingPercentage = 0.2;
  @Input() barSeriesInnersSpacing = 0.2;
  @Input() set stacked(stacked: boolean) {
    this.isStacked = stacked;
    this.calcDomainsAndResize();
  }

  public isStacked = false;

  public transformXAxis = '';
  public transformYAxis = '';

  public processedData: INgxDateValue[] = [];
  public processedDataSeries: INgxDateValueSeries[] = [];

  public xDomain: [Date, Date] = [new Date(), new Date()];
  public yDomain: [number, number] = [0, 100];

  public xScale: any;
  public yScale: any;

  public fullWidth = 800;
  public fullHeight = 400;
  public chartHeight = 800;
  public chartWidth = 400;

  public barWidth = 5;

  public internalId = `ngx-date-bar-chart${Math.round(
    Math.random() * 1_000_000
  )}`;

  private padding = { top: 10, left: 50, right: 0, bottom: 20 };

  constructor(
    private helperService: HelperService,
    private preProcessorService: PreProcessorService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.resize());
  }

  // mock method
  private calculateDimension() {
    this.chartHeight = this.fullHeight - this.padding.top - this.padding.bottom;
    this.chartWidth = this.fullWidth - this.padding.left - this.padding.right;

    // translates axis to left and bottom
    this.transformXAxis = `translate(${this.padding.left},${
      this.chartHeight + this.padding.top
    })`;
    this.transformYAxis = `translate(${this.padding.left},${this.padding.top})`;

    const daysDiff = this.helperService.daysDiff(this.xDomain);

    this.barWidth = this.helperService.getBarWidth(
      this.chartWidth,
      this.barSpacingPercentage,
      daysDiff
    );
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

    let xAxis = d3
      .axisBottom(this.xScale)
      .tickFormat((x: AxisDomain) => this.formatDate(x));

    if (this.fixedXTicks) {
      xAxis = xAxis.tickValues(
        this.fixedXTicks.map((d) => this.preProcessorService.toStartOfDay(d))
      );
    } else {
      xAxis = xAxis.ticks(d3.timeDay);
      xAxis = xAxis.tickValues(
        this.helperService.createTicksBasedOnWidth(
          this.chartWidth,
          this.xDomain,
          this.minSpacePerXTick
        )
      );
    }

    const xAxisElement: any = this.selectChart().selectAll('g.x-axis');
    xAxisElement.call(xAxis);

    let yAxis = d3.axisLeft(this.yScale).tickSizeOuter(0);

    if (this.fixedYTicks) {
      yAxis = yAxis.tickValues(this.fixedYTicks);
    }

    const yAxisElement: any = this.selectChart().selectAll('g.y-axis');

    yAxisElement.call(yAxis);
  }

  private formatDate(x: AxisDomain): string {
    const value = x.valueOf();
    const date = new Date(value);
    if (this.formatDateFunction) {
      return this.formatDateFunction(date);
    }

    const options: any = { month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  }

  private selectChart() {
    return d3.select(`#${this.internalId}`).select('svg');
  }

  public resize(): void {
    const node = this.selectChart().node();
    if (!node || !('getBoundingClientRect' in node)) {
      throw new Error(
        'cannot calculate width and height correctly, this should not happen. Please contact library maintainer.'
      );
    }

    const rect = node.getBoundingClientRect();
    this.fullWidth = rect.width;
    this.fullHeight = rect.height;

    this.calculateDimension();
    this.initScales();
    this.drawAxis();
  }

  public calcDomainsAndResize(): void {
    if (this.processedData?.length) {
      this.xDomain = this.helperService.getXDomain(this.processedData);
      this.yDomain = this.helperService.getYDomain(this.processedData);
    }
    if (this.processedDataSeries?.length) {
      this.xDomain = this.helperService.getXDomain(this.processedDataSeries);
      this.yDomain = this.helperService.getYDomainSeries(
        this.processedDataSeries,
        this.isStacked
      );
    }
    setTimeout(() => this.resize());
  }
}
