import React, { Component } from "react";
import AutoComplete from "./AutoComplete";
import DateRangeSelector from "./DateRangeSelector";
import { connect } from "react-redux";
import { searchTickers, getTickers } from "../services/stockService";

const mapStateToProps = state => ({
  symbols: state.symbols,
  startDate: state.startDate,
  endDate: state.endDate,
  colours: state.colours
});

const mapDispatchToProps = dispatch => ({
  onSymbolsSelected: symbols => {
    dispatch({ type: "SYMBOLS_SELECTED", symbols });
  },
  onDateRangeSelected: (startDate, endDate) => {
    dispatch({
      type: "DATE_RANGE_SELECTED",
      startDate: startDate,
      endDate: endDate
    });
  },
  onDateRangeReset: () => {
    dispatch({ type: "DATE_RANGE_RESET" });
  }
});

class StockPicker extends Component {
  state = {
    tickers: []
  };

  async componentDidMount() {
    var data = await getTickers(this.props.symbols);

    this.setState(() => ({
      tickers: data
    }));
  }

  handleChange = symbols => {
    this.setState(() => ({
      tickers: symbols.map(symbol => symbol)
    }));

    this.props.onSymbolsSelected(symbols.map(symbol => symbol.value));
  };

  handleLoadOptions = (inputValue, callback) => {
    searchTickers(inputValue).then(tickers => {
      callback(tickers);
    });
  };

  handleChipColour(label) {
    var symbol = label.match(/\((.*)\)/).pop();
    var colourCode = this.props.colours.filter(
      colour => colour.symbol === symbol
    )[0].colour;
    return colourCode;
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flexGrow: 1 }}>
          <AutoComplete
            placeholder="Select multiple stocks"
            chipColour={this.handleChipColour.bind(this)}
            loadOptions={this.handleLoadOptions}
            onChange={this.handleChange}
            value={this.state.tickers}
            label="Stocks"
          />
        </div>
        <div style={{ minWidth: 250, paddingLeft: 10, flexGrow: 0 }}>
          <DateRangeSelector
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            onDateRangeSelected={this.props.onDateRangeSelected}
            onDateRangeReset={this.props.onDateRangeReset}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StockPicker);
