import {Component, OnInit, Input} from '@angular/core';
import * as d3 from 'd3';
import {INgxDateValue} from './interfaces/date-value.interface';
import {HelperService} from './services/helper.service';
import {AxisDomain} from 'd3';
import {PreProcessorService} from './services/pre-processor.service';
import {INgxDateValueSeries} from './interfaces/date-value-series.interface';
import {LegendPosition} from './enums/legend-position.enum';

@Component({
  selector: 'ngx-date-bar-chart',
  templateUrl: './ngx-date-bar-chart.component.html',
  styleUrls: ['./ngx-date-bar-chart.component.css'],
})
export class NgxDateBarChartComponent implements OnInit {
  @Input() set data(data: INgxDateValue[] | INgxDateValueSeries[]) {
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

  @Input() customDrawing:
    | ((
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
  ) => void)
    | undefined;

  @Input() formatDateFunction: ((date: Date) => string) | undefined;

  @Input() fixedXTicks: Date[] | undefined;
  @Input() fixedYTicks: number[] | undefined;

  @Input() rounded = true;
  @Input() barRadiusFunction: ((barWidth: number) => number) | undefined;

  @Input() colors: string[] = ['#fc092c'];

  @Input() minSpacePerXTick = 60;
  @Input() legendLabels: string[] = [];
  @Input() legendPosition: LegendPosition = LegendPosition.BOTTOM_LEFT;
  @Input() xAxisLabel: string | undefined = '';
  @Input() yAxisLabel: string | undefined = '';

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
  @Input() barSeriesInnersSpacing = 0.05;

  @Input() set stacked(stacked: boolean) {
    this.isStacked = stacked;
    this.calcDomainsAndResize();
  }

  public isStacked = false;
  @Input() fontSizeTicks = '1rem';

  @Input() set yMax(yMax: number | undefined) {
    this.manualYMax = yMax;
    this.calcDomainsAndResize();
  }

  @Input() set yMin(yMin: number | undefined) {
    this.manualYMin = yMin;
    this.calcDomainsAndResize();
  }

  @Input() set xMin(xMin: Date | undefined) {
    this.manualXMin = xMin;
    this.calcDomainsAndResize();
  }

  @Input() set xMax(xMax: Date | undefined) {
    this.manualXMax = xMax;
    this.calcDomainsAndResize();
  }

  @Input() set horizontalLine(line: {yValue: number, color: string, widthPx: number}) {
    this._horizontalLine = line;
    this.calcDomainsAndResize();
  }

  private manualXMax: Date | undefined;
  private manualXMin: Date | undefined;

  private _horizontalLine: {yValue: number, color: string, widthPx: number} | undefined;

  public transformXAxis = '';
  public transformYAxis = '';
  public transformXAxisLabel = '';
  public transformYAxisLabel = '';

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

  private padding = {top: 10, left: 70, right: 10, bottom: 60};

  private manualYMax: number | undefined = undefined;
  private manualYMin: number | undefined = undefined;

  constructor(
    private helperService: HelperService,
    private preProcessorService: PreProcessorService
  ) {
  }

  ngOnInit(): void {
    this.resize();
  }

  public resize(): void {
    setTimeout(() => {
      this.updateDimensions();
      this.calculateTransformations();
      this.calculateBarWidth();
      this.initScales();
      this.drawAxis();
      this.drawHorizontalLine();
      this.drawCustomDrawing();
    });
  }

  /**
   * special method to draw custom stuff with d3 while having full access to d3 params
   * you can draw anywhere you want or you use the predefined <g></g> spaces, which
   * you can select via class-names
   *  'custom-before-rendering'
   *  'custom-between-bar-and-axis'
   *  'custom-after-rendering'
   */
  drawCustomDrawing(): void {
    if (this.customDrawing !== undefined) {
      this.customDrawing(
        this.selectChart(),
        this.fullWidth,
        this.fullHeight,
        this.chartHeight,
        this.chartWidth,
        this.barWidth,
        this.padding,
        this.xScale,
        this.yScale,
        this.processedData,
        this.processedDataSeries,
        this.xDomain,
        this.yDomain
      );
    }
  }

  private drawHorizontalLine(): void {
    this.selectChart()
      .selectAll('.horizontal-line') // add class to html
      .selectAll('line')
      .remove();

    if (!this._horizontalLine) {
      return;
    }

    this.selectChart()
      .selectAll('.horizontal-line')
      .append('line')
      .style('stroke', this._horizontalLine.color)
      .style('stroke-width', this._horizontalLine.widthPx)
      .attr('x1', this.padding.left)
      .attr('y1', this.yScale(this._horizontalLine.yValue) + this.padding.top)
      .attr(
        'x2',
        this.chartWidth + this.padding.left
      )
      .attr(
        'y2',
        this.yScale(this._horizontalLine.yValue) + this.padding.top
      );
  }

  private calculateTransformations() {
    // translates axis to left and bottom
    this.transformXAxis = `translate(${this.padding.left},${
      this.chartHeight + this.padding.top
    })`;
    this.transformYAxis = `translate(${this.padding.left},${this.padding.top})`;

    this.transformXAxisLabel = `translate(${
      this.padding.left + this.chartWidth / 2
    }, ${this.fullHeight - 4})`;

    this.transformYAxisLabel = `rotate(-90) translate(${
      -this.chartHeight / 2 + this.padding.top
    }, ${0})`;
  }

  private calculateBarWidth(): void {
    this.barWidth = this.helperService.getBarWidth(
      this.chartWidth,
      this.barSpacingPercentage,
      this.xDomain
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

    // x axis
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

    // y-axis
    let yAxis = d3.axisLeft(this.yScale).tickSizeOuter(0);

    if (this.fixedYTicks) {
      yAxis = yAxis.tickValues(this.fixedYTicks);
    }

    const yAxisElement: any = this.selectChart().selectAll('g.y-axis');
    yAxisElement.call(yAxis);

    // lastly: adjust font-sizes of tick text
    this.selectChart()
      .selectAll('.axis text')
      .style('font-size', this.fontSizeTicks);

    this.selectChart()
      .selectAll('.x-axis .tick text')
      .style('transform', 'translate(0,3px)');
  }

  private formatDate(x: AxisDomain): string {
    const value = x.valueOf();
    const date = new Date(value);
    if (this.formatDateFunction) {
      return this.formatDateFunction(date);
    }

    const options: any = {month: '2-digit', day: '2-digit'};
    return date.toLocaleDateString('en-US', options);
  }

  private selectChart() {
    return d3.select(`#${this.internalId}`).select('svg');
  }

  private updateDimensions(): void {
    const node = this.selectChart().node();
    if (!node || !('getBoundingClientRect' in node)) {
      throw new Error(
        'cannot calculate width and height correctly, this should not happen. Please contact library maintainer.'
      );
    }
    const rect = node.getBoundingClientRect();
    this.fullWidth = rect.width;
    this.fullHeight = rect.height;
    this.chartHeight = this.fullHeight - this.padding.top - this.padding.bottom;
    this.chartWidth = this.fullWidth - this.padding.left - this.padding.right;
  }

  public getFlexClass(position: LegendPosition): string {
    if (position.includes('Left')) {
      return '';
    }
    if (position.includes('Right')) {
      return 'align-flex-center';
    }
    return 'align-flex-center';
  }

  private calcDomainsAndResize(): void {
    const data =
      this.processedData.length > 0
        ? this.processedData
        : this.processedDataSeries;
    this.xDomain = this.helperService.getXDomain(
      data,
      this.manualXMin,
      this.manualXMax
    );
    this.yDomain = this.helperService.getYDomain(
      data,
      this.manualYMin,
      this.manualYMax,
      this.isStacked
    );

    this.resize();
  }
}
