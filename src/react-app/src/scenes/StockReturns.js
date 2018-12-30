import React, { Component } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import StockChart from "../components/StockChart";
import StockReturnsStatsPanel from "../components/StockReturnsStatsPanel";
import { getReturns } from "../services/stockService";

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
  up: {
    color: "green"
  },
  down: {
    color: "red"
  }
};

const mapStateToProps = state => ({
  symbols: state.symbols,
  colours: state.colours,
  startDate: state.startDate,
  endDate: state.endDate
});

const mapDispatchToProps = dispatch => ({
  onLoading: () => {
    dispatch({ type: "FETCHING_START" });
  },
  onLoaded: () => {
    dispatch({ type: "FETCHING_END" });
  },
  onDateRangeSelected: (startDate, endDate) => {
    dispatch({
      type: "DATE_RANGE_SELECTED",
      startDate: startDate,
      endDate: endDate
    });
  }
});

class StockReturns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null
    };
    this.sidePanel = React.createRef();
  }

  handleDateRangeSelected(startDate, endDate) {
    this.props.onDateRangeSelected(startDate, endDate);
  }
  handleDateSelected(date) {
    this.setState(prevState => ({
      selectedDate: date
    }));
  }
  getChartData(symbol, startDate, endDate) {
    return getReturns(symbol, startDate, endDate);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h5">Cumulative returns</Typography>
        <Typography color="textSecondary">
          Click a point on the chart for key statistics for that date
        </Typography>
        <Paper elevation={1} className={classes.paper}>
          <div style={{ flexGrow: 1, position: "relative" }}>
            <StockChart
              getData={this.getChartData}
              yAxisLabel="Closing price - USD"
              onLoading={this.props.onLoading}
              onLoaded={this.props.onLoaded}
              symbols={this.props.symbols}
              startDate={this.props.startDate}
              endDate={this.props.endDate}
              colours={this.props.colours}
              onDateRangeSelected={this.handleDateRangeSelected.bind(this)}
              onDateSelected={this.handleDateSelected.bind(this)}
            />
          </div>
          <StockReturnsStatsPanel
            ref={this.sidePanel}
            symbols={this.props.symbols}
            startDate={this.props.startDate}
            date={this.state.selectedDate}
            onLoading={this.props.onLoading}
            onLoaded={this.props.onLoaded}
          />
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StockReturns)
);
