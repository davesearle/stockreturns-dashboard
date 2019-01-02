import React, { Component } from "react";
import AutoComplete from "./AutoComplete";
import DateRangeSelector from "./DateRangeSelector";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: { display: "flex", flexDirection: "row" },
  popperPaper: { marginTop: 0, zIndex: 100 },
  autoComplete: { flexGrow: 1 },
  dateRangeSelector: { minWidth: 250, paddingLeft: 10, flexGrow: 0 }
};

class StockPicker extends Component {
  handleChange = symbols => {
    this.props.onSymbolsSelected(symbols.map(symbol => symbol.value));
  };

  handleChipColour(label) {
    let symbol = label.match(/\((.*)\)/).pop();
    let colourCode = this.props.colours.filter(
      colour => colour.symbol === symbol
    )[0].colour;
    return colourCode;
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.autoComplete}>
          <AutoComplete
            placeholder="Select multiple stocks"
            chipColour={this.handleChipColour.bind(this)}
            loadOptions={this.props.onSearchTickers}
            onChange={this.handleChange}
            value={this.props.tickers}
            label="Stocks"
          />
        </div>
        <div className={classes.dateRangeSelector}>
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

export default withStyles(styles, { withTheme: true })(StockPicker);
