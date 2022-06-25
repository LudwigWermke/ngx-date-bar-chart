import { Component } from '@angular/core';
import { INgxDateValue } from 'projects/ngx-date-bar-chart/src/lib/interfaces/date-value.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public data: INgxDateValue[] = [];

  constructor() {
    const data: INgxDateValue[] = [];
    for (let i = 0; i < 10; ++i) {
      const date = new Date();
      date.setDate(new Date().getDate() + i);

      data.push({
        date,
        value: i * i,
      });
    }

    this.data = data;
  }
}
