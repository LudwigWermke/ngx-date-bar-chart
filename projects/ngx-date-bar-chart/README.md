# About ngx-date-bar-chart

Since building charts in angular with dates on the x-axis (on a day interval) was a lot of work, we build our own easy to use and responsive chart that does all the annoying stuff for you.

We also added a really cool feature (see 'customDrawing'), where you have access to all parameters of our chart from the outside. This enables you to draw individual stuff with d3 directly on the chart, which was previously really complex and required hacking the code.

## Demo and code repo

- for a quick demo, check out [stackblitz](https://stackblitz.com/edit/angular-tyzwtg)
- code: [github](https://github.com/LudwigWermke/ngx-date-bar-chart), including a demo project (same as on stackblitz):

## Chart types

- simple bar chart with one bar per day
- bar series with multiple bars per day
- stacked bars for each day

## Installation

```bash
npm install ngx-date-bar-chart
```

## Usage

In your module add NgxDateBarChartModule to the imports:

```ts
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

You can check out more examples in the demo project, for this just head over to github and build the demo :)

1. Set up some data

```ts
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

```html
<ngx-date-bar-chart
  [colors]="['navy', 'dodgerblue']"
  [data]="data"
></ngx-date-bar-chart>
```

3. If you want multiple values per day just change the type of data to 'INgxDateValueSeries[]' and you are good to go:

```ts
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

```html
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

`stacked: boolean` whether the chart is stacked or not

## bars, padding, and colors

`barSpacingPercentage: number` amount of space that is distributed between the bars as space (range from 0 to 1)

`barSeriesInnersSpacing: number` only relevant for series; amount of space that is distributed between the bars for each date

`rounded: boolean`: whether the bars are rounded (defaults to true)

`barRadiusFunction: ((barWidth: number) => number)` use this, if you want your bar-radius to be custom

`colors: string[]` set some nice colors, if more colors are present than required (e.g. single bars and two colors) they just repeat

## domains

`yMax: number` set a maximum y-value (all higher values are clamped)

`yMin: number` set a minimum y-value (e.g. 0, all lower values will be clamped). If the type is stacked, 0 is default

`xMax: Date` set a maximum x-value (all higher values are clamped)

`xMin: Date` set a minimum x-value (all lower values are clamped)

## labels, axis, and ticks

`formatDateFunction: ((date: Date) => string)`
use this to format the x-axis dates the way you want them

`fixedXTicks: Date[]` use specific x-ticks instead of the automatically generated ones

` fixedYTicks: number[]` same as x-ticks

`minSpacePerXTick: number` minimum amount of space required to display an x tick (in px)

`legendLabels: string[]` list of the legend labels for each data row

`legendPosition: LegendPosition` position of the legend (e.g. BottomLeft (default))

`xAxisLabel: string` label for the x-axis

`yAxisLabel: string` label for the y-axis

`xAxisHeight: number` height of the x-axis (aka space for the ticks and the x-axis-label)

`yAxisWidth: number` width of the y-axis (aka space for the ticks and the y-axis-label)

`fontSizeTicks: string` font size of ticks and axis-descriptions

## custom drawings

```ts
customDrawing: ((
  boundingSvgSelection: any,
  fullWidth: number,
  fullHeight: number,
  chartHeight: number,
  chartWidth: number,
  barWidth: number,
  padding: { top: number; left: number; right: number; bottom: number },

  xScale: any,
  yScale: any,

  dataSingle: INgxDateValue[],
  dataSeries: INgxDateValueSeries[],
  xDomain: [Date, Date],
  yDomain: [number, number]
) => void
```

With this method you can draw on the chart yourself and access internal variables like `chartWidth` or `xScale` (for more info on scales consult the d3 docs). 
<br><br>
Having access to e.g. the chart-width and chart-height enables you to draw a custom trendline. 
<br><br>
To illustrate this functionality, the following code draws a line from the top left corner of the chart, to the top of the bar that is exactly in the middle. This makes no sense, but it demonstrates, how simple it is to add your custom stuff.

```ts
customDrawing = (
boundingSvgSelection: any,

    fullWidth: number,
    fullHeight: number,
    chartHeight: number,
    chartWidth: number,
    barWidth: number,
    padding: { top: number; left: number; right: number; bottom: number },

    xScale: any,
    yScale: any,

    dataSingle: INgxDateValue[],
    dataSeries: INgxDateValueSeries[],
    xDomain: [Date, Date],
    yDomain: [number, number]

) => {
// lazy removal of all stuff (so it won't get rendered twice
boundingSvgSelection
.selectAll('.custom-after-rendering')
.selectAll('line')
.remove();

    /*
     *  append a red line
     *  use the other g containers to render the line on the level you want
     *  'custom-before-rendering'
     *  'custom-between-bar-and-axis'
     *  'custom-after-rendering'
     */
    boundingSvgSelection
      .selectAll('.custom-after-rendering')
      .append('line')
      .style('stroke', 'red')
      .style('stroke-width', 3)
      .attr('x1', padding.left)
      .attr('y1', padding.top)
      .attr(
        'x2',
        padding.left +
          xScale(dataSingle[Math.floor(dataSingle.length / 2)].date)
      )
      .attr(
        'y2',
        padding.top +
          yScale(dataSingle[Math.floor(dataSingle.length / 2)].value)
      );

};
```
All you need to do now, is to pass the function in the html template like this:  `[customDrawing]="customDrawing"` :)
