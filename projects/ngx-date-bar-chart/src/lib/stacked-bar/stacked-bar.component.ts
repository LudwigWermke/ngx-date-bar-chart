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

  private internalColors: string[] = ['green'];

  private get numberOfEntries() {
    return this.entry?.values?.length || 1; // less than 1 will not be rendered
  }

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

  public get radius(): number {
    if (!this.rounded) {
      return 0;
    }
    if (this.barRadiusFunction) {
      return this.barRadiusFunction(this.barWidth);
    }
    return Math.min(this.barWidth > 1 ? this.barWidth / 3 : 1, 20);
  }
}
