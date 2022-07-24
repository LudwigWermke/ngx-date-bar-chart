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
  @Input() index = 0;
  @Input() set colors(colors: string[]) {
    if (!colors || colors?.length === 0) {
      return;
    }
    this.color = colors[this.index % colors.length];
  }

  // passed on to base bar
  @Input() rounded = true;
  @Input() barRadiusFunction: ((barWidth: number) => number) | undefined;
  public color = 'dodgerblue';

  constructor() {}

  ngOnInit(): void {}

  public get x(): number {
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

  // TODO: bug if 0 not in range
  public get height(): number {
    // diff to start this.
    const diff = this.y - this.getY(this.yDomain[1]);
    const rest = this.getY(this.yDomain[0]) - diff;
    return rest;
  }

  public get y(): number {
    return this.getY(this.entry?.value);
  }
}
