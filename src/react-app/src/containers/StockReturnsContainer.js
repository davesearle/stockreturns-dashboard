import React, { Component } from "react";
import StockReturns from "../components/StockReturns";
import { connect } from "react-redux";
import { dateSelected, dateRangeSelected } from "../actions/appActions";
import {
  fetchReturnsTimeSeries,
  fetchReturnsMetrics
} from "../actions/returnsActions";

const mapStateToProps = state => ({
  symbols: state.app.symbols,
  colours: state.app.colours,
  startDate: state.app.startDate,
  endDate: state.app.endDate,
  selectedDate: state.app.selectedDate,
  series: state.returnsTimeSeries.series,
  returns: state.returns
});

const mapDispatchToProps = dispatch => ({
  onDateRangeSelected: (startDate, endDate) => {
    dispatch(dateRangeSelected(startDate, endDate));
  },
  onDateSelected: date => {
    dispatch(dateSelected(date));
  },
  onGetReturnsTimeSeries: (symbols, startDate, endDate, forceReload) => {
    dispatch(fetchReturnsTimeSeries(symbols, startDate, endDate, forceReload));
  },
  onGetReturnsMetrics: (symbols, startDate, endDate) => {
    dispatch(fetchReturnsMetrics(symbols, startDate, endDate));
  }
});

class StockReturnsContainer extends Component {
  refreshReturnsTimeSeries(forceReload) {
    this.props.onGetReturnsTimeSeries(
      this.props.symbols,
      this.props.startDate,
      this.props.endDate,
      forceReload
    );
  }

  refreshReturnsMetrics() {
    if (this.props.selectedDate === null) return;
    if (Date.parse(this.props.startDate) > Date.parse(this.props.selectedDate))
      return;
    this.props.onGetReturnsMetrics(
      this.props.symbols,
      this.props.startDate,
      this.props.selectedDate
    );
  }

  componentDidMount() {
    this.refreshReturnsTimeSeries(true);
    this.refreshReturnsMetrics();
  }

  componentDidUpdate(prevProps) {
    if (this.props.symbols !== prevProps.symbols) {
      this.refreshReturnsTimeSeries(false);
    }
    if (
      this.props.startDate !== prevProps.startDate ||
      this.props.endDate !== prevProps.endDate
    ) {
      this.refreshReturnsTimeSeries(true);
    }
    if (this.props.selectedDate !== prevProps.selectedDate) {
      this.refreshReturnsMetrics();
    }
  }

  render() {
    return (
      <StockReturns
        series={this.props.series}
        metrics={this.props.returns.metrics}
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
)(StockReturnsContainer);
