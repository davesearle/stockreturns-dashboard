import React, { Component } from "react";
import StockChart from "./StockChart";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import StockPricesMetrics from "./StockPricesMetrics";
import { withStyles } from "@material-ui/core/styles";

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
  stockChart: {
    flexGrow: 1,
    position: "relative"
  }
};

class StockPrices extends Component {
  handleDateRangeSelected(startDate, endDate) {
    if (this.props.onDateRangeSelected) {
      this.props.onDateRangeSelected(startDate, endDate);
    }
  }
  handleDateSelected(date) {
    if (this.props.onDateSelected) {
      this.props.onDateSelected(date);
    }
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
          <div className={classes.stockChart}>
            <StockChart
              series={this.props.series}
              yAxisLabel="Closing price - USD"
              // eslint-disable-next-line
              yAxisFormat="${value}"
              symbols={this.props.symbols}
              startDate={this.props.startDate}
              endDate={this.props.endDate}
              colours={this.props.colours}
              selectedDate={this.props.selectedDate}
              onDateRangeSelected={this.handleDateRangeSelected.bind(this)}
              onDateSelected={this.handleDateSelected.bind(this)}
            />
          </div>
          <StockPricesMetrics
            ref={this.sidePanel}
            symbols={this.props.symbols}
            startDate={this.props.startDate}
            date={this.props.selectedDate}
            metrics={this.props.metrics}
          />
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(StockPrices);
