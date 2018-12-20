import React, { Component } from "react";
import ReactHighcharts from 'react-highcharts';
import axios from 'axios'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const getOptions = () => {
    return {
        title: {
            text: ''
        },
        chart: {
            zoomType: 'x'
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Closing price - USD'
            }
        },
    }
}

const styles = {
    root: {
        display:'flex',
        flexDirection: 'column',
        flexGrow:1
    },
    paper: {
        display:'flex',
        flexDirection: 'column',
        flexGrow:1,
        position:'relative'
    },
    chartContainer: {
        height:'100%',
        width:'100%',
        position:'absolute',
        overflow:'hidden',
        padding:'30px 30px 30px 10px'
    },
    chart: {
        height:'98%',
        position:'relative'
    }
};
  
const mapStateToProps = (state) => ({
    symbols: state.symbols
})

const mapDispatchToProps = (dispatch) => ({
})

class StockPriceChart extends Component {

    getData = (symbol, callback) => {
        axios.get('http://localhost:5000/prices/' + symbol)
            .then(response => {

                var prices = Array.from(response.data.map(item => [item.Date, item.Close]));
                callback(prices);
            })
            .catch(error => { console.log(error); })
            .then(() => { });
    }

    findSeriesIndex(symbol) {
        let chart = this.refs.chart.getChart();
        let seriesLength = chart.series.length;

        for (var i = 0; i < seriesLength; i++) {
            if (chart.series[i].name === symbol)
                return i;
        }
        return -1;
    }

    componentDidMount() {
        this.props.symbols.forEach((symbol) => {
            this.getData(symbol, (prices) => {
                let newSeries = { name: symbol, data: prices }
                this.setState(prevState => ({
                    series: [...prevState ? prevState.series : [], newSeries]
                }))
            });
        });
    }

    componentDidUpdate(prevProps) {

        if (this.props.symbols !== prevProps.symbols) {

            // for new symbols, get the price data and add to the component's state
            this.props.symbols.forEach((symbol) => {
                if (prevProps.symbols.indexOf(symbol) === -1) {
                    this.getData(symbol, (prices) => {
                        let newSeries = { name: symbol, data: prices }
                        this.setState(prevState => ({
                            series: [...prevState.series, newSeries]
                        }))
                    });
                }
            });

            // for deleted symbols, remove them from the state
            prevProps.symbols.forEach((symbol) => {
                if (this.props.symbols.indexOf(symbol) === -1) {
                    this.setState(prevState => ({
                        series: prevState.series.filter((item, _) => item.name !== symbol)
                    }))
                }
            });
        }

        this.renderSeries(this.state.series);
    }

    renderSeries(series) {

        let chart = this.refs.chart.getChart();
        let symbols = Array.from(series.map((item) => item.name));

        // for each series in the state, make sure it's been added to the chart
        series.forEach(item => {
            if (this.findSeriesIndex(item.name) === -1)
                chart.addSeries(item)
        })

        // remove series from the chart that arent in the state
        chart.series.forEach(item => {
            if (symbols.indexOf(item.name) === -1)
                item.remove();
        })
    }

    render() {
        const options = getOptions();
        const { classes } = this.props;
        
        return (
            <div className={classes.root}>
                <Typography variant="h5">
                    Closing prices
                </Typography>
                <div style={{ height: 10 }}></div>
                <Paper elevation={1} className={classes.paper}>
                    <div className={classes.chartContainer}>
                        <ReactHighcharts
                            ref="chart"
                            config={options}
                            isPureConfig
                            neverReflow
                            domProps = {{className: classes.chart}}
                        />
                    </div>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(StockPriceChart));