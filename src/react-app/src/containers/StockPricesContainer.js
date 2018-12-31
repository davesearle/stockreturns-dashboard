import React, { Component } from "react";
import StockPrices from "../components/StockPrices";
import { connect } from "react-redux";
import { fetchPricesTimeSeries } from "../actions/pricesActions";

const mapStateToProps = state => ({
  symbols: state.app.symbols,
  colours: state.app.colours,
  startDate: state.app.startDate,
  endDate: state.app.endDate,
  series: state.pricesTimeSeries.series
});

const mapDispatchToProps = dispatch => ({
  onGetChartData: (symbols, startDate, endDate) => {
    dispatch(fetchPricesTimeSeries(symbols, startDate, endDate));
  }
});

class StockPricesContainer extends Component {
  refreshChartData() {
    this.props.onGetChartData(
      this.props.symbols,
      this.props.startDate,
      this.props.endDate
    );
  }

  componentDidMount() {
    this.refreshChartData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.symbols !== prevProps.symbols) {
      this.refreshChartData();
    }
  }

  render() {
    return (
      <StockPrices
        series={this.props.series}
        symbols={this.props.symbols}
        startDate={this.props.startDate}
        endDate={this.props.endDate}
        colours={this.props.colours}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StockPricesContainer);
