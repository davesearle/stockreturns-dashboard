import React, { Component } from "react";
import TimeSeriesChart from "../components/TimeSeriesChart";

const getColour = (colours, symbol) => {
  var colourCode = colours.filter(colour => colour.symbol === symbol)[0].colour;
  return colourCode;
};

class StockChart extends Component {
  constructor(props) {
    super(props);

    this.chart = React.createRef();

    this.state = {
      series: []
    };
  }

  handleDateRangeSelected(startDate, endDate) {
    if (this.props.onDateRangeSelected)
      this.props.onDateRangeSelected(startDate, endDate);
  }

  handleDateSelected(date) {
    if (this.props.onDateSelected) this.props.onDateSelected(date);
  }

  async loadSeries(symbols, startDate, endDate, reload) {
    this.props.onLoading();
    var tasks = symbols.map(symbol => {
      return this.props.getData(symbol, startDate, endDate).then(data => {
        if (reload) {
          this.chart.removeSeries(symbol);
        }
        let newSeries = {
          name: symbol,
          data: data,
          color: getColour(this.props.colours, symbol)
        };
        this.setState(prevState => ({
          series: [
            ...(prevState
              ? reload
                ? prevState.series.filter(item => item.name !== symbol)
                : prevState.series
              : []),
            newSeries
          ]
        }));
      });
    });

    await Promise.all(tasks)
      .then(() => {
        this.props.onLoaded();
      })
      .catch(error => {
        this.props.onLoaded();
      });
  }

  deleteSeries(symbols) {
    symbols.forEach(symbol => {
      this.setState(prevState => ({
        series: prevState.series.filter((item, _) => item.name !== symbol)
      }));
    });
  }

  async componentDidMount() {
    await this.loadSeries(
      this.props.symbols,
      this.props.startDate,
      this.props.endDate
    );
  }

  async componentDidUpdate(prevProps) {
    if (
      this.props.startDate !== prevProps.startDate ||
      this.props.endDate !== prevProps.endDate
    ) {
      await this.loadSeries(
        this.props.symbols,
        this.props.startDate,
        this.props.endDate,
        true
      );
    }

    if (this.props.symbols !== prevProps.symbols) {
      let seriesToLoad = this.props.symbols.filter(
        symbol => prevProps.symbols.indexOf(symbol) === -1
      );
      let seriesToDelete = prevProps.symbols.filter(
        symbol => this.props.symbols.indexOf(symbol) === -1
      );

      await this.loadSeries(
        seriesToLoad,
        this.props.startDate,
        this.props.endDate
      );
      this.deleteSeries(seriesToDelete);
    }
  }
  render() {
    return (
      <TimeSeriesChart
        onRef={ref => (this.chart = ref)}
        series={this.state.series}
        yAxisLabel={this.props.yAxisLabel}
        onDateRangeSelected={this.handleDateRangeSelected.bind(this)}
        onDateSelected={this.handleDateSelected.bind(this)}
      />
    );
  }
}

export default StockChart;
