import { Component, Input, OnInit } from '@angular/core';
import { INgxDateValueSeries } from '../interfaces/date-value-series.interface';

@Component({
  selector: 'g[ngx-date-bar-series-bar]',
  templateUrl: './series-bar.component.html',
  styleUrls: ['./series-bar.component.css'],
})
export class SeriesBarComponent implements OnInit {
  @Input() entry: INgxDateValueSeries | undefined;
  @Input() barWidth = 5;
  @Input() xScale: any;
  @Input() yScale: any;
  @Input() yDomain = [0, 100];
  @Input() rounded = true;
  @Input() index = 0;
  @Input() barRadiusFunction: ((barWidth: number) => number) | undefined;
  @Input() set colors(colors: string[]) {
    if (!colors || colors?.length === 0) {
      return;
    }
    this.internalColors = colors;
  }

  private internalColors: string[] = ['green'];

  public color(index: number): string {
    return this.internalColors[index % this.internalColors.length];
  }

  private internalId = `ngx-date-bar-chart-bar-${Math.round(
    Math.random() * 1_000_000
  )}-${this.index}`;

  constructor() {}

  ngOnInit(): void {}

  public x(index: number): number {
    if (!this.xScale || !this.entry?.date) {
      return 0;
    }
    return (
      this.xScale(this.entry.date) -
      this.barWidth / 2 +
      this.width * index +
      ((this.barWidth * 0.1) / this.entry.values.length) * index +
      (this.barWidth * 0.05) / this.entry.values.length
    );
  }

  public get width(): number {
    if (!this.entry?.values?.length) {
      return this.barWidth;
    }
    return (this.barWidth * 0.9) / this.entry.values.length;
  }

  private getY(value: number | undefined): number {
    if (!this.yScale || (!value && value !== 0)) {
      return 0;
    }
    return this.yScale(value);
  }

  // TODO: bug if 0 not in range
  public height(index: number): number {
    // return Math.abs(this.getY(0) - this.getY(this.entry?.value));
    // diff to start this.
    const diff = this.y(index) - this.getY(this.yDomain[1]);
    const rest = this.getY(this.yDomain[0]) - diff;
    return rest;
  }

  public y(index: number): number {
    return this.getY(this.entry?.values[index]);
  }

  public getClipId(index: number): string {
    return `${this.internalId}-bar-clip-path-${index}`;
  }

  public getClipUrl(index: number): string {
    return `url(#${this.getClipId(index)})`;
  }

  public get radius(): number {
    if (this.barRadiusFunction) {
      return this.barRadiusFunction(this.barWidth);
    }
    const divider = this.entry?.values?.length || 1;
    return Math.min(this.barWidth > 1 ? this.barWidth / divider / 3 : 1, 20);
  }

  getValues(): number[] {
    if (this.entry?.values?.length) {
      return this.entry.values;
    }
    return [];
  }
}
