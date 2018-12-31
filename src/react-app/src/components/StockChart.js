import React, { Component } from "react";
import TimeSeriesChart from "./TimeSeriesChart";

class StockChart extends Component {
  constructor(props) {
    super(props);

    this.chart = React.createRef();

    this.state = {
      series: []
    };
  }

  handleDateRangeSelected(startDate, endDate) {
    if (this.props.onDateRangeSelected) {
      this.props.onDateRangeSelected(startDate, endDate);
    }
  }

  handleDateSelected(date) {
    if (this.props.onDateSelected) {
      this.props.onDateSelected(date);
    }
  }

  renderSeries() {
    var series = this.props.series.map(item => {
      let colour = this.props.colours.find(c => c.symbol === item.name);
      return {
        name: item.name,
        color: colour !== undefined ? colour.colour : null,
        data: item.data
      };
    });

    this.setState(prevState => ({
      series: series
    }));
  }

  async componentDidMount() {
    this.renderSeries();
  }

  componentDidUpdate(prevProps) {
    if (this.props.series !== prevProps.series) {
      this.renderSeries();
    }
  }

  render() {
    var series = this.state.series;
    return (
      <TimeSeriesChart
        onRef={ref => (this.chart = ref)}
        series={series}
        yAxisLabel={this.props.yAxisLabel}
        yAxisFormat={this.props.yAxisFormat}
        onDateRangeSelected={this.handleDateRangeSelected.bind(this)}
        onDateSelected={this.handleDateSelected.bind(this)}
        selectedDate={this.props.selectedDate}
      />
    );
  }
}

export default StockChart;
