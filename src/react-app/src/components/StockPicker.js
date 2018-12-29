import React, { Component } from "react";
import AutoComplete from "./AutoComplete";
import { connect } from "react-redux";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import DateRange from "@material-ui/icons/DateRange";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import SettingsBackupRestore from "@material-ui/icons/SettingsBackupRestore";

const styles = {
  root: {},
  popperPaper: {
    marginTop: 0,
    zIndex: 100
  }
};

const searchTickers = search => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:5000/tickers/search/" + (search ? search : ""))
      .then(response => {
        var tickers = response.data.map(ticker => ({
          value: ticker.symbol,
          label: ticker.name + " (" + ticker.symbol + ")"
        }));

        resolve(tickers);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      })
      .then(() => {});
  });
};

const getTicker = symbol => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:5000/tickers/" + symbol)
      .then(response => {
        var ticker = response.data.map(ticker => ({
          value: ticker.symbol,
          label: ticker.name + " (" + ticker.symbol + ")"
        }))[0];

        resolve(ticker);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      })
      .then(() => {});
  });
};

const mapStateToProps = state => ({
  symbols: state.symbols,
  startDate: state.startDate,
  endDate: state.endDate
});

const mapDispatchToProps = dispatch => ({
  onSymbolsSelected: symbols => {
    dispatch({ type: "SYMBOLS_SELECTED", symbols });
  },
  onDateRangeChanged: (startDate, endDate) => {
    dispatch({ type: "DATE_RANGE", startDate: startDate, endDate: endDate });
  },
  onDateRangeReset: () => {
    dispatch({ type: "DATE_RANGE_RESET" });
  }
});

const getTickers = async symbols => {
  var tasks = symbols.map(symbol => {
    return getTicker(symbol).then(ticker => {
      return {
        value: ticker.value,
        label: ticker.label
      };
    });
  });
  return await Promise.all(tasks);
};

class StockPicker extends Component {
  state = {
    tickers: [],
    open: false
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
  handleSelect(ranges) {
    console.log(ranges);
    this.props.onDateRangeChanged(
      ranges.selection.startDate.toISOString().slice(0, 10),
      ranges.selection.endDate.toISOString().slice(0, 10)
    );
  }
  handleClickAway = () => {
    this.setState({
      open: false
    });
  };
  handleReset = e => {
    this.props.onDateRangeReset();
    e.stopPropagation();
  };
  handleClick = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open
    }));
  };
  render() {
    const selectionRange = {
      startDate: new Date(this.props.startDate),
      endDate: new Date(this.props.endDate),
      key: "selection"
    };
    const { anchorEl, open } = this.state;
    const { classes } = this.props;

    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flexGrow: 1 }}>
          <AutoComplete
            placeholder="Select multiple stocks"
            loadOptions={this.handleLoadOptions}
            onChange={this.handleChange}
            value={this.state.tickers}
            label="Stocks"
          />
        </div>
        <div style={{ minWidth: 250, paddingLeft: 10, flexGrow: 0 }}>
          <TextField
            id="outlined-read-only-input"
            label="Date range"
            style={{ width: "100%" }}
            value={this.props.startDate + " - " + this.props.endDate}
            onClick={this.handleClick}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <DateRange />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label="Reset"
                    className={classes.margin}
                    onClick={this.handleReset.bind(this)}
                  >
                    <SettingsBackupRestore />
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="outlined"
          />
          <Popover
            id="simple-popper"
            open={open}
            anchorEl={anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
          >
            <ClickAwayListener onClickAway={this.handleClickAway}>
              <Paper className={classes.popperPaper}>
                <DateRangePicker
                  ranges={[selectionRange]}
                  onChange={this.handleSelect.bind(this)}
                />
              </Paper>
            </ClickAwayListener>
          </Popover>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StockPicker)
);
