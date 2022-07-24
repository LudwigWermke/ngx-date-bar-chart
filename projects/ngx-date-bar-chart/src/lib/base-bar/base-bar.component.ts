import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'g[ngx-base-bar]',
  templateUrl: './base-bar.component.html',
  styleUrls: ['./base-bar.component.css'],
})
export class BaseBarComponent implements OnInit {
  @Input() x = 0;
  @Input() y = 0;
  @Input() width = 0;
  @Input() height = 0;

  @Input() rounded = true;
  @Input() barRadiusFunction: ((barWidth: number) => number) | undefined;

  @Input() color = 'dodgerblue';

  // passed from above component (as a string, so series with multiple-values
  // can be represented as well
  @Input() index = 1;

  private internalId = `ngx-date-bar-chart-bar-${Math.round(
    Math.random() * 1_000_000
  )}-${this.index}`;

  constructor() {}

  ngOnInit(): void {}

  public getClipId(): string {
    return `${this.internalId}-bar-clip-path`;
  }

  public getClipUrl(): string {
    return `url(#${this.getClipId()})`;
  }

  public get radius(): number {
    if (this.barRadiusFunction) {
      return this.barRadiusFunction(this.width);
    }
    return Math.min(this.width > 1 ? this.width / 3 : 1, 20);
  }
}
