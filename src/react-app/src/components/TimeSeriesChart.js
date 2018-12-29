import React, { Component } from "react";
import ReactHighcharts from "react-highcharts";
import Highcharts from "highcharts";
import { withStyles } from "@material-ui/core/styles";

const getChartOptions = (onSelection, onClick, props) => {
  return {
    title: {
      text: ""
    },
    chart: {
      zoomType: "x",
      events: {
        selection: event => {
          if (event.xAxis != null) {
            onSelection(event.xAxis[0].min, event.xAxis[0].max);
            return false;
          }
        },
        click: event => {
          onClick(event.xAxis[0].value);
        }
      },
      resetZoomButton: {
        theme: {
          display: "none"
        }
      }
    },
    plotOptions: {
      series: {
        lineWidth: 1.5,
        marker: {
          enabled: false
        },
        states: {
          hover: {
            enabled: false
          }
        },
        events: {
          click: event => {
            onClick(Highcharts.dateFormat("%Y-%m-%d", event.point.x));
          }
        }
      }
    },
    tooltip: {
      shared: true,
      crosshairs: true
    },
    xAxis: {
      type: "datetime",
      labels: {
        rotation: -45
      }
    },
    yAxis: {
      title: {
        text: props.yAxisLabel
      },
      labels: {
        format: "{value}%"
      }
    }
  };
};

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1
  },
  paper: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    position: "relative",
    marginTop: 10
  },
  chartContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    overflow: "hidden",
    padding: "30px 30px 10px 10px"
  },
  chart: {
    height: "100%",
    position: "relative"
  }
};

class TimeSeriesChart extends Component {
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
    this.renderSeries();
  }
  componentDidUpdate() {
    this.renderSeries();
  }
  clearAllSeries() {
    const chart = this.refs.chart.getChart();
    while (chart.series.length > 0) {
      chart.series[0].remove(true);
    }
  }
  removeSeries(name) {
    let chart = this.refs.chart.getChart();
    chart.series.forEach(item => {
      if (item.name === name) item.remove(true);
    });
    chart.reflow();
  }
  renderSeries() {
    if (this.props.series == null) return;

    let chart = this.refs.chart.getChart();
    let stateSeries = this.props.series.map(item => item.name);
    let chartSeries = chart.series.map(item => item.name);

    // for each series in the state, make sure it's been added to the chart
    this.props.series.forEach(stateSeriesItem => {
      if (chartSeries.indexOf(stateSeriesItem.name) === -1)
        chart.addSeries(stateSeriesItem);
    });

    // remove series from the chart that arent in the state
    chart.series.forEach(item => {
      if (stateSeries.indexOf(item.name) === -1) item.remove(true);
    });

    chart.reflow();
  }
  findNearestPoint(x, points) {
    var closestPoint;
    var distance = Number.MAX_VALUE;

    points.forEach(point => {
      var dist = Math.abs(x - point.x);
      if (dist < distance) {
        distance = dist;
        closestPoint = point;
      }
    });

    return closestPoint;
  }
  addPlotLine(closestPoint, date) {
    const chart = this.refs.chart.getChart();
    chart.series[0].xAxis.removePlotLine("plotline");
    chart.series[0].xAxis.addPlotLine({
      value: closestPoint.x,
      color: "#999",
      width: 1,
      dashStyle: "dash",
      id: "plotline",
      label: {
        text: date,
        style: {
          color: "#333"
        }
      }
    });
  }
  handleClick(x) {
    const chart = this.refs.chart.getChart();
    const points = chart.series[0].data;

    var closestPoint = this.findNearestPoint(x, points);

    if (closestPoint == null) return;

    var date = Highcharts.dateFormat("%Y-%m-%d", closestPoint.x);

    this.addPlotLine(closestPoint, date);

    if (this.props.onDateSelected) this.props.onDateSelected(date);
  }
  handleSelection(minX, maxX) {
    const chart = this.refs.chart.getChart();
    const points = chart.series[0].data;

    var closestPointMinX = this.findNearestPoint(minX, points);
    var closestPointMaxX = this.findNearestPoint(maxX, points);
    var startDate = Highcharts.dateFormat("%Y-%m-%d", closestPointMinX.x);
    var endDate = Highcharts.dateFormat("%Y-%m-%d", closestPointMaxX.x);

    if (this.props.onDateRangeSelected)
      this.props.onDateRangeSelected(startDate, endDate);
  }
  render() {
    const options = getChartOptions(
      this.handleSelection.bind(this),
      this.handleClick.bind(this),
      this.props
    );
    const { classes } = this.props;

    return (
      <div className={classes.chartContainer}>
        <ReactHighcharts
          ref="chart"
          config={options}
          isPureConfig
          neverReflow
          domProps={{ className: classes.chart }}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TimeSeriesChart);
