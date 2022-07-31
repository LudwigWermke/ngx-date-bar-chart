# About ngx-date-bar-chart
A clean, responsive, and easy to use bar chart specialised in dealing with dates on a 'day'-interval.

## Demo
[View demo on stackblitz] (https://stackblitz.com/edit/angular-tyzwtg)

## Chart types
- simple bar chart with one bar per day
- bar series with multiple bars per day
- stacked bars for each day
## Installation
```
npm install ngx-date-bar-chart
```

## Usage
In your module add NgxDateBarChartModule to the imports:
```
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxDateBarChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

## Simple Example 
You can check out more examples in the demo project, for this just head over to github and 
and build the demo :) 
1. Set up some data
```
    const data: INgxDateValue[] = [];
    const today = new Date();
    
    for (let i = 0; i < 15; ++i) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      data.push({
        new Date(date),
        value: i * i,
      });
    }
```
2. Use the chart in you html-template and maybe add some nice colors
```
<ngx-date-bar-chart
  [colors]="['navy', 'dodgerblue']"
  [data]="data"
></ngx-date-bar-chart>
```
3. If you want multiple values per day just change the type of data to 'INgxDateValueSeries[]' and you are good to go:
```
   const data: INgxDateValueSeries[] = []; 
   const today = new Date();
    
    for (let i = 0; i < 15; ++i) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      data.push({
        new Date(date),
        values: [i, 2*i, 3 * i],
      });
    }
```
4. If you want your data stacked, just set the stacked attribute in the html-template.
```
<ngx-date-bar-chart
  [colors]="['navy', 'dodgerblue']"
  [data]="data"
  [stacked]="true"
></ngx-date-bar-chart>
```

# Customization aka inputs 
Use these inputs to style the chart the way you want it
## data and chart type
`data: INgxDateValue[] | INgxDateValueSeries[]` aka the 'input', has to be set

`stacked` whether the chart is stacked or not

## bars, padding, and colors
`barSpacingPercentage` amount of space that is distributed between the bars as space (range from 0 to 1)

`barSeriesInnersSpacing` only relevant for series; amount of space that is distributed between the bars for each date

`rounded`: whether the bars are rounded (defaults to true)

`barRadiusFunction: ((barWidth: number) => number)` use this, if you want your bar-radius to be custom

`colors: string[]` set some nice colors, if more colors are present than required (e.g. single bars and two colors) they just repeat


## domains
`yMax: number` set a maximum y-value (all higher values are clamped)

`yMin: number` set a minimum y-value (e.g. 0, all lower values will be clamped). If the type is stacked, 0 is default 

## labels, axis, and ticks
```formatDateFunction: ((date: Date) => string)```
use this to format the x-axis dates the way you want them

```fixedXTicks: Date[]``` use specific x-ticks instead of the automatically generated ones

``` fixedYTicks: number[]``` same as x-ticks

`minSpacePerXTick: number` minimum amount of space required to display an x tick (in px)

`legendLabels: string[]` list of the legend labels for each data row

`legendPosition: LegendPosition` position of the legend (e.g. BottomLeft (default))

`xAxisLabel: string` label for the x-axis

`yAxisLabel: string` label for the y-axis

`xAxisHeight: number` height of the x-axis (aka space for the ticks and the x-axis-label)

`yAxisWidth: number` width of the y-axis (aka space for the ticks and the y-axis-label)

`fontSizeTicks: string` font size of ticks and axis-descriptions 




