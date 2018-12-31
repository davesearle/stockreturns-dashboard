import React, { Component } from "react";
import StockChart from "./StockChart";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
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
  }
};

class StockPrices extends Component {
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
            series={this.props.series}
            yAxisLabel="Closing price - USD"
            // eslint-disable-next-line
            yAxisFormat="${value}"
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

export default withStyles(styles, { withTheme: true })(StockPrices);
