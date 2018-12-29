import React, { Component } from "react";
import StockChart from "../components/StockChart";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { getPrices } from "../services/stockService";

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
  }
});

class StockPriceChart extends Component {
  getData(symbol, startDate, endDate) {
    return getPrices(symbol, startDate, endDate);
  }
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h5">Closing prices</Typography>
        <Typography color="textSecondary">
          Click a point on the chart for key statistics for that date
        </Typography>
        <Paper elevation={1} className={classes.paper}>
          <StockChart
            getData={this.getData}
            yAxisLabel="Closing price - USD"
            onLoading={this.props.onLoading}
            onLoaded={this.props.onLoaded}
            symbols={this.props.symbols}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            colours={this.props.colours}
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
  )(StockPriceChart)
);
