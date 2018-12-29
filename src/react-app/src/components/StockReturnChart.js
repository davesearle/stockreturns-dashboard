import React, { Component } from "react";
import ReactHighcharts from "react-highcharts";
import Highcharts from "highcharts";
import axios from "axios";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";

const getChartOptions = (onSelection, onClick) => {
  return {
    title: {
      text: ""
    },
    chart: {
      zoomType: "x",
      events: {
        selection: event => {
          if (event.xAxis != null) {
            onSelection(event.xAxis[0].min, event.xAxis[0].max);
            return false;
          }
        },
        click: event => {
          onClick(event.xAxis[0].value);
        }
      },
      resetZoomButton: {
        theme: {
          display: "none"
        }
      }
    },
    plotOptions: {
      series: {
        lineWidth: 1.5,
        marker: {
          enabled: false
        },
        states: {
          hover: {
            enabled: false
          }
        },
        events: {
          click: event => {
            onClick(Highcharts.dateFormat("%Y-%m-%d", event.point.x));
          }
        }
      }
    },
    tooltip: {
      shared: true,
      crosshairs: true
    },
    xAxis: {
      type: "datetime",
      labels: {
        rotation: -45
      }
    },
    yAxis: {
      title: {
        text: "Returns"
      },
      labels: {
        format: "{value}%"
      }
    }
  };
};

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
    position: "relative"
  },
  chartContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    overflow: "hidden",
    padding: "30px 30px 10px 10px"
  },
  chart: {
    height: "100%",
    position: "relative"
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
  onDateRangeChanged: (startDate, endDate) => {
    dispatch({ type: "DATE_RANGE", startDate: startDate, endDate: endDate });
  }
});

const getData = (symbol, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "http://localhost:5000/returns/" +
          symbol +
          "/" +
          startDate +
          "/" +
          endDate
      )
      .then(response => {
        var data = response.data.map(item => [item.date, item.return]);
        resolve(data);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

const getStatistics = (symbol, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "http://localhost:5000/statistics/" +
          symbol +
          "/" +
          startDate +
          "/" +
          endDate
      )
      .then(response => {
        var data = response.data;
        resolve(data[0]);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

const getColour = (colours, symbol) => {
  var colourCode = colours.filter(colour => colour.symbol === symbol)[0].colour;
  return colourCode;
};

class StockReturnChart extends Component {
  constructor(props) {
    super(props);

    this.sidePanel = React.createRef();

    this.state = {
      stats: [],
      series: []
    };
  }

  async loadSeries(symbols, startDate, endDate, reload) {
    this.props.onLoading();
    var tasks = symbols.map(symbol => {
      return getData(symbol, startDate, endDate).then(data => {
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

    this.renderSeries();
  }

  renderSeries() {
    let chart = this.refs.chart.getChart();
    let stateSymbols = this.state.series.map(item => item.name);
    let chartSymbols = chart.series.map(item => item.name);

    // for each series in the state, make sure it's been added to the chart
    this.state.series.forEach(item => {
      if (chartSymbols.indexOf(item.name) === -1) chart.addSeries(item);
    });

    // remove series from the chart that arent in the state
    chart.series.forEach(item => {
      if (stateSymbols.indexOf(item.name) === -1) item.remove();
    });

    chart.reflow();
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

  findNearestPoint(x, points) {
    // why isnt this built into highcharts??
    var closestPoint;
    var distance = Number.MAX_VALUE;

    points.forEach(point => {
      var dist = Math.abs(x - point.x);
      if (dist < distance) {
        distance = dist;
        closestPoint = point;
      }
    });

    return closestPoint;
  }

  handleClick(x) {
    this.sidePanel.current.style.width = "250px";
    this.sidePanel.current.style.padding = "10px";

    const chart = this.refs.chart.getChart();
    const points = chart.series[0].data;

    var closestPoint = this.findNearestPoint(x, points);

    if (closestPoint == null) return;

    var date = Highcharts.dateFormat("%Y-%m-%d", closestPoint.x);

    chart.series[0].xAxis.removePlotLine("plotline");
    chart.series[0].xAxis.addPlotLine({
      value: closestPoint.x,
      color: "#999",
      width: 1,
      dashStyle: "dash",
      id: "plotline",
      label: {
        text: date,
        style: {
          color: "#333"
        }
      }
    });

    this.loadStats(date);
  }

  handleSelection(minX, maxX) {
    const chart = this.refs.chart.getChart();
    const points = chart.series[0].data;

    var closestPointMinX = this.findNearestPoint(minX, points);
    var closestPointMaxX = this.findNearestPoint(maxX, points);
    var startDate = Highcharts.dateFormat("%Y-%m-%d", closestPointMinX.x);
    var endDate = Highcharts.dateFormat("%Y-%m-%d", closestPointMaxX.x);

    this.props.onDateRangeChanged(startDate, endDate);
  }

  render() {
    const options = getChartOptions(
      this.handleSelection.bind(this),
      this.handleClick.bind(this)
    );
    const { classes } = this.props;
    const stats = this.state.stats;

    return (
      <div className={classes.root}>
        <Typography variant="h5">Cumulative returns</Typography>
        <Typography className={classes.pos} color="textSecondary">
          Click a point on the chart for key statistics for that date
        </Typography>
        <div style={{ height: 10 }} />
        <Paper elevation={1} className={classes.paper}>
          <div style={{ flexGrow: 1, position: "relative" }}>
            <div className={classes.chartContainer}>
              <ReactHighcharts
                ref="chart"
                config={options}
                isPureConfig
                neverReflow
                domProps={{ className: classes.chart }}
              />
            </div>
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
