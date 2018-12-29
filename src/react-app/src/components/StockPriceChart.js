import React, { Component } from "react";
import TimeSeriesChart from "./TimeSeriesChart";
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

const getColour = (colours, symbol) => {
  var colourCode = colours.filter(colour => colour.symbol === symbol)[0].colour;
  return colourCode;
};

class StockPriceChart extends Component {
  state = {
    series: []
  };

  async loadSeries(symbols, startDate, endDate, reload) {
    this.props.onLoading();
    var tasks = symbols.map(symbol => {
      return getPrices(symbol, startDate, endDate).then(data => {
        if (reload) {
          let chart = this.refs.chart.getChart();
          chart.series.forEach(item => {
            if (item.name === symbol) item.remove();
          });
        }
        let newSeries = {
          name: symbol,
          data: data,
          color: getColour(this.props.colours, symbol)
        };
        this.setState(prevState => ({
          series: [
            ...(prevState
              ? reload
                ? prevState.series.filter(item => item.name !== symbol)
                : prevState.series
              : []),
            newSeries
          ]
        }));
      });
    });

    await Promise.all(tasks)
      .then(() => {
        this.props.onLoaded();
      })
      .catch(error => {
        this.props.onLoaded();
      });
  }

  deleteSeries(symbols) {
    symbols.forEach(symbol => {
      this.setState(prevState => ({
        series: prevState.series.filter((item, _) => item.name !== symbol)
      }));
    });
  }

  async componentDidMount() {
    await this.loadSeries(
      this.props.symbols,
      this.props.startDate,
      this.props.endDate
    );
  }

  async componentDidUpdate(prevProps) {
    if (
      this.props.startDate !== prevProps.startDate ||
      this.props.endDate !== prevProps.endDate
    ) {
      await this.loadSeries(
        this.props.symbols,
        this.props.startDate,
        this.props.endDate,
        true
      );
    }

    if (this.props.symbols !== prevProps.symbols) {
      let seriesToLoad = this.props.symbols.filter(
        symbol => prevProps.symbols.indexOf(symbol) === -1
      );
      let seriesToDelete = prevProps.symbols.filter(
        symbol => this.props.symbols.indexOf(symbol) === -1
      );

      await this.loadSeries(
        seriesToLoad,
        this.props.startDate,
        this.props.endDate
      );
      this.deleteSeries(seriesToDelete);
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
          <TimeSeriesChart
            series={this.state.series}
            yAxisLabel="Closing price - USD"
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
