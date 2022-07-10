import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDateBarChartComponent } from './ngx-date-bar-chart.component';

describe('NgxDateBarChartComponent', () => {
  let component: NgxDateBarChartComponent;
  let fixture: ComponentFixture<NgxDateBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxDateBarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxDateBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
