import { Component, Input, OnInit } from '@angular/core';
import { INgxDateValue } from '../interfaces/date-value.interface';

@Component({
  selector: 'g[ngx-date-bar-chart-single-bar]',
  templateUrl: './single-bar.component.html',
  styleUrls: ['./single-bar.component.css'],
})
export class SingleBarComponent implements OnInit {
  @Input() entry: INgxDateValue | undefined;
  @Input() barWidth = 5;
  @Input() xScale: any;
  @Input() yScale: any;
  @Input() yDomain = [0, 100];
  @Input() rounded = true;
  @Input() index = 0;
  @Input() barRadiusFunction: ((barWidth: number) => number) | undefined;

  private internalId = `ngx-date-bar-chart-bar-${Math.round(
    Math.random() * 1_000_000
  )}-${this.index}`;

  constructor() {}

  ngOnInit(): void {}

  public get x(): number {
    if (!this.xScale || !this.entry?.date) {
      return 0;
    }
    return this.xScale(this.entry.date) - this.barWidth / 2;
  }

  public get width(): number {
    return this.barWidth;
  }

  private getY(value: number | undefined): number {
    if (!this.yScale || (!value && value !== 0)) {
      return 0;
    }
    return this.yScale(value);
  }

  // TODO: bug if 0 not in range
  public get height(): number {
    // return Math.abs(this.getY(0) - this.getY(this.entry?.value));
    // diff to start this.
    const diff = this.y - this.getY(this.yDomain[1]);
    const rest = this.getY(this.yDomain[0]) - diff;
    return rest;
  }

  public get y(): number {
    return this.getY(this.entry?.value);
  }

  public getClipId(): string {
    return `${this.internalId}-bar-clip-path`;
  }

  public getClipUrl(): string {
    return `url(#${this.getClipId()})`;
  }

  public get radius(): number {
    if (this.barRadiusFunction) {
      return this.barRadiusFunction(this.barWidth);
    }
    return Math.min(this.barWidth > 1 ? this.barWidth / 3 : 1, 40);
  }
}
