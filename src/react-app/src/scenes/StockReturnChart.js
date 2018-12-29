import React, { Component } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import StockChart from "../components/StockChart";
import { getReturns, getStatistics } from "../services/stockService";

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

class StockReturnChart extends Component {
  constructor(props) {
    super(props);

    this.sidePanel = React.createRef();

    this.state = {
      stats: []
    };
  }

  async loadStats(endDate) {
    this.props.onLoading();
    var tasks = this.props.symbols.map(symbol => {
      return getStatistics(symbol, this.props.startDate, endDate).then(data => {
        let stats = {
          symbol: symbol,
          name: data.name,
          return: data.return,
          startDate: new Date(this.props.startDate),
          endDate: new Date(endDate)
        };
        this.setState(prevState => ({
          stats: [
            ...prevState.stats.filter(item => item.symbol !== symbol),
            stats
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

  handleDateRangeSelected(startDate, endDate) {
    this.props.onDateRangeSelected(startDate, endDate);
  }
  handleDateSelected(date) {
    this.sidePanel.current.style.width = "250px";
    this.sidePanel.current.style.padding = "10px";
    this.loadStats(date);
  }
  getData(symbol, startDate, endDate) {
    return getReturns(symbol, startDate, endDate);
  }

  render() {
    const { classes } = this.props;
    const stats = this.state.stats;

    return (
      <div className={classes.root}>
        <Typography variant="h5">Cumulative returns</Typography>
        <Typography color="textSecondary">
          Click a point on the chart for key statistics for that date
        </Typography>
        <Paper elevation={1} className={classes.paper}>
          <div style={{ flexGrow: 1, position: "relative" }}>
            <StockChart
              getData={this.getData}
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
          <div
            style={{
              flexGrow: 0,
              position: "relative",
              borderLeft: "1px solid #ccc",
              width: 0,
              overflow: "hidden",
              backgroundColor: "#efefef"
            }}
            ref={this.sidePanel}
          >
            {stats
              .sort((a, b) => ("" + a.name).localeCompare(b.name))
              .map((item, index) => (
                <div key={item.name}>
                  <Card className={classes.card} style={{ marginTop: 10 }}>
                    <CardContent>
                      <Typography variant="subtitle2" className={classes.title}>
                        {item.name}
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        {item.startDate.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}{" "}
                        -
                        {item.endDate.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </Typography>
                      <Typography
                        variant="h5"
                        component="h2"
                        className={item.return >= 0 ? classes.up : classes.down}
                      >
                        {item.return >= 0 ? <ArrowUpward /> : <ArrowDownward />}
                        {item.return}%
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StockReturnChart)
);
