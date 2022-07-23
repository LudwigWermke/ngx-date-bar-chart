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
  @Input() indexOfEntry = 0;
  @Input() barRadiusFunction: ((barWidth: number) => number) | undefined;
  @Input() set colors(colors: string[]) {
    if (!colors || colors?.length === 0) {
      return;
    }
    this.internalColors = colors;
  }
  @Input() paddingBetweenBars = 0.2;

  private internalColors: string[] = ['green'];

  private get numberOfEntries() {
    return this.entry?.values?.length || 1; // less than 1 will not be rendered
  }

  public color(index: number): string {
    return this.internalColors[index % this.internalColors.length];
  }

  constructor() {}

  ngOnInit(): void {}

  public x(index: number): number {
    if (!this.xScale || !this.entry?.date) {
      return 0;
    }

    return (
      this.xScale(this.entry.date) -
      this.barWidth / 2 +
      (this.barWidth / this.numberOfEntries) * index
    );
  }

  public get width(): number {
    return (
      (this.barWidth * (1 - this.paddingBetweenBars)) / this.numberOfEntries
    );
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
}
