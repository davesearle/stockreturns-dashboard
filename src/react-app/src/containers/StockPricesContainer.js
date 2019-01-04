import React, { Component } from "react";
import StockPrices from "../components/StockPrices";
import { connect } from "react-redux";
import {
  fetchPricesTimeSeries,
  fetchPricesMetrics
} from "../actions/pricesActions";
import { dateSelected, dateRangeSelected } from "../actions/appActions";

const mapStateToProps = state => ({
  symbols: state.app.symbols,
  colours: state.app.colours,
  startDate: state.app.startDate,
  endDate: state.app.endDate,
  selectedDate: state.app.selectedDate,
  series: state.pricesTimeSeries.series,
  prices: state.prices
});

const mapDispatchToProps = dispatch => ({
  onGetPricesTimeSeries: (symbols, startDate, endDate, forceReload) => {
    dispatch(fetchPricesTimeSeries(symbols, startDate, endDate, forceReload));
  },
  onDateRangeSelected: (startDate, endDate) => {
    dispatch(dateRangeSelected(startDate, endDate));
  },
  onDateSelected: date => {
    dispatch(dateSelected(date));
  },
  onGetPricesMetrics: (symbols, selectedDate) => {
    dispatch(fetchPricesMetrics(symbols, selectedDate));
  }
});

class StockPricesContainer extends Component {
  refreshPricesTimeSeries(forceReload) {
    this.props.onGetPricesTimeSeries(
      this.props.symbols,
      this.props.startDate,
      this.props.endDate,
      forceReload
    );
  }

  refreshPricesMetrics() {
    if (this.props.selectedDate === null) return;
    this.props.onGetPricesMetrics(this.props.symbols, this.props.selectedDate);
  }
  refreshChartData() {
    this.props.onGetChartData(
      this.props.symbols,
      this.props.startDate,
      this.props.endDate
    );
  }

  componentDidMount() {
    this.refreshPricesTimeSeries(true);
    this.refreshPricesMetrics();
  }

  componentDidUpdate(prevProps) {
    if (this.props.symbols !== prevProps.symbols) {
      this.refreshPricesTimeSeries();
    }
    if (
      this.props.startDate !== prevProps.startDate ||
      this.props.endDate !== prevProps.endDate
    ) {
      this.refreshPricesTimeSeries(true);
      this.refreshPricesMetrics();
    }
    if (this.props.selectedDate !== prevProps.selectedDate) {
      this.refreshPricesMetrics();
    }
  }

  render() {
    return (
      <StockPrices
        series={this.props.series}
        metrics={this.props.prices.metrics}
        symbols={this.props.symbols}
        startDate={this.props.startDate}
        endDate={this.props.endDate}
        colours={this.props.colours}
        selectedDate={this.props.selectedDate}
        onDateSelected={this.props.onDateSelected}
        onDateRangeSelected={this.props.onDateRangeSelected}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StockPricesContainer);
