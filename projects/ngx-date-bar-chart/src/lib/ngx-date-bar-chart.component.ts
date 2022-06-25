import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import {INgxDateValue} from './interfaces/date-value.interface';
import {HelperService} from './services/helper.service';

@Component({
  selector: 'ngx-date-bar-chart',
  templateUrl: './ngx-date-bar-chart.component.html',
  styleUrls: ['./ngx-date-bar-chart.component.css']
})
export class NgxDateBarChartComponent implements OnInit {
  @Input() set data(data: INgxDateValue[]) {
    // TODO: preprocess etc, abort if no data
    this.processedData = data;
    this.xDomain = this.helperService.getXDomain(this.processedData);
    this.yDomain = this.helperService.getYDomain(this.processedData);
  }

  public processedData: INgxDateValue[] = [];

  public xDomain: [Date, Date] = [new Date(), new Date()];
  public yDomain: [number, number] = [0, 100];

  constructor(private helperService: HelperService) { }

  ngOnInit(): void {
  }

}
