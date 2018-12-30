import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { getStatistics } from "../services/stockService";

const styles = {
  up: {
    color: "green"
  },
  down: {
    color: "red"
  }
};

class StockReturnsStatsPanel extends Component {
  constructor(props) {
    super(props);
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
  async componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      this.loadStats(this.props.date);
    }
  }
  render() {
    const { classes } = this.props;
    const stats = this.state.stats;

    return (
      <div
        style={{
          flexGrow: 0,
          position: "relative",
          borderLeft: "1px solid #ccc",
          overflow: "hidden",
          backgroundColor: "#efefef",
          width: this.props.date ? 250 : 0,
          padding: this.props.date ? 10 : 0
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
    );
  }
}

export default withStyles(styles, { withTheme: true })(StockReturnsStatsPanel);
