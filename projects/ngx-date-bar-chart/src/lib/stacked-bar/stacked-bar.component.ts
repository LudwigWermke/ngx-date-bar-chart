import { Component, Input, OnInit } from '@angular/core';
import { INgxDateValueSeries } from '../interfaces/date-value-series.interface';

@Component({
  selector: 'g[ngx-date-bar-stacked-bar]',
  templateUrl: './stacked-bar.component.html',
  styleUrls: ['./stacked-bar.component.css'],
})
export class StackedBarComponent implements OnInit {
  @Input() entry: INgxDateValueSeries | undefined;
  @Input() barWidth = 5;
  @Input() xScale: any;
  @Input() yScale: any;
  @Input() yDomain = [0, 100];
  @Input() rounded = true;
  @Input() indexOfEntry = 0;
  @Input() barRadiusFunction: ((barWidth: number) => number) | undefined;
  @Input() set colors(colors: string[]) {
    if (!colors || colors?.length === 0) {
      return;
    }
    this.internalColors = colors;
  }
  @Input() index = 1;

  private internalId = `ngx-date-bar-chart-bar-${Math.round(
    Math.random() * 1_000_000
  )}-${this.index}`;

  private internalColors: string[] = ['green'];

  public color(index: number): string {
    return this.internalColors[index % this.internalColors.length];
  }

  constructor() {}

  ngOnInit(): void {}

  public get x() {
    if (!this.xScale || !this.entry?.date) {
      return 0;
    }

    return this.xScale(this.entry.date) - this.barWidth / 2;
  }

  private getY(value: number | undefined): number {
    if (!this.yScale || (!value && value !== 0)) {
      return 0;
    }
    return this.yScale(value);
  }

  public height(index: number): number {
    if (index > 0) {
      return Math.abs(this.y(index) - this.y(index - 1));
    }
    const diff = this.y(0) - this.getY(this.yDomain[1]);
    return this.getY(this.yDomain[0]) - diff;
  }

  private get values() {
    return this.entry?.values || [];
  }

  public y(index: number): number {
    if (index < 0) {
      return 0;
    }
    let sum = 0;
    for (let i = 0; i <= index; ++i) {
      sum += this.values[i];
    }

    return this.getY(sum);
  }

  public get maxY(): number {
    let sum = 0;
    this.values.forEach((c) => (sum += c));
    return this.getY(sum);
  }

  public get maxHeight(): number {
    const diff = this.maxY - this.getY(this.yDomain[1]);
    return this.getY(this.yDomain[0]) - diff;
  }

  public get radius(): number {
    if (!this.rounded) {
      return 0;
    }
    if (this.barRadiusFunction) {
      return this.barRadiusFunction(this.barWidth);
    }
    return Math.min(this.barWidth > 1 ? this.barWidth / 3 : 1, 20);
  }

  public getClipId(): string {
    return `${this.internalId}-bar-clip-path`;
  }

  public getClipUrl(): string {
    return `url(#${this.getClipId()})`;
  }
}
