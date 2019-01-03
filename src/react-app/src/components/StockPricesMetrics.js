import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    flexGrow: 0,
    position: "relative",
    borderLeft: "1px solid #ccc",
    overflow: "auto",
    backgroundColor: "#efefef"
  },
  card: {
    marginTop: 10
  },
  tableRow: {
    height: "auto"
  },
  tableLabelCell: {
    padding: 0
  }
};
function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}
class StockPricesMetrics extends Component {
  getColour(symbol) {
    var colourMap = this.props.colours.find(c => c.symbol === symbol);
    if (colourMap !== undefined) return colourMap.colour;
  }
  render() {
    const { classes } = this.props;
    const metrics = this.props.metrics;

    return (
      <div
        className={classes.root}
        style={{
          width: metrics.length > 0 ? 250 : 0,
          padding: metrics.length > 0 ? 10 : 0
        }}
        ref={this.sidePanel}
      >
        {metrics
          .sort((a, b) => ("" + a.name).localeCompare(b.name))
          .map((item, index) => (
            <div key={item.name}>
              <Card
                className={classes.card}
                style={{
                  borderLeft: "4px solid " + this.getColour(item.symbol)
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" className={classes.title}>
                    {item.name}
                  </Typography>
                  <Typography color="textSecondary">{item.date}</Typography>

                  <Table padding="dense">
                    <TableBody>
                      <TableRow className={classes.tableRow}>
                        <TableCell className={classes.tableLabelCell}>
                          Open
                        </TableCell>
                        <TableCell align="right">
                          ${ccyFormat(item.open)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.tableRow}>
                        <TableCell className={classes.tableLabelCell}>
                          Close
                        </TableCell>
                        <TableCell align="right">
                          ${ccyFormat(item.close)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.tableRow}>
                        <TableCell className={classes.tableLabelCell}>
                          High
                        </TableCell>
                        <TableCell align="right">
                          ${ccyFormat(item.high)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.tableRow}>
                        <TableCell className={classes.tableLabelCell}>
                          Low
                        </TableCell>
                        <TableCell align="right">
                          ${ccyFormat(item.low)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.tableRow}>
                        <TableCell className={classes.tableLabelCell}>
                          Volume
                        </TableCell>
                        <TableCell align="right">{item.volume}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ))}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(StockPricesMetrics);
