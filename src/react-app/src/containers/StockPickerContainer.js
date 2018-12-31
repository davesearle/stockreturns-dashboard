import React, { Component } from "react";
import StockPicker from "../components/StockPicker";
import { connect } from "react-redux";
import { default as tickerService } from "../services/tickerService";

import {
  symbolsSelected,
  dateRangeReset,
  dateRangeSelected
} from "../actions/appActions";

const mapStateToProps = state => ({
  symbols: state.app.symbols,
  startDate: state.app.startDate,
  endDate: state.app.endDate,
  colours: state.app.colours,
  tickers: state.app.tickers
});

const mapDispatchToProps = dispatch => ({
  onSymbolsSelected: symbols => {
    dispatch(symbolsSelected(symbols));
  },
  onDateRangeSelected: (startDate, endDate) => {
    dispatch(dateRangeSelected(startDate, endDate));
  },
  onDateRangeReset: () => {
    dispatch(dateRangeReset());
  },
  onSearchTickers: (inputValue, callback) => {
    tickerService.searchTickers(inputValue).then(tickers => {
      callback(tickers);
    });
  },
  onGetTickers: (symbols, callback) => {
    tickerService.getTickers(symbols).then(tickers => {
      callback(tickers);
    });
  }
});

class StockPickerContainer extends Component {
  state = {
    tickers: []
  };

  componentDidMount() {
    this.props.onGetTickers(this.props.symbols, tickers => {
      this.setState(state => ({
        tickers: tickers
      }));
    });
  }

  render() {
    return (
      <StockPicker
        tickers={this.state.tickers}
        startDate={this.props.startDate}
        endDate={this.props.endDate}
        colours={this.props.colours}
        onSymbolsSelected={this.props.onSymbolsSelected}
        onDateRangeSelected={this.props.onDateRangeSelected}
        onDateRangeReset={this.props.onDateRangeReset}
        onSearchTickers={this.props.onSearchTickers}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StockPickerContainer);
