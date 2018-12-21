import React, { Component } from "react";
import ReactHighcharts from 'react-highcharts';
import axios from 'axios'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const getChartOptions = () => {
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
    onLoading: () => {
        dispatch({ type: 'FETCHING_START' })
    },
    onLoaded: () => {
        dispatch({ type: 'FETCHING_END' })
    }
})

const getData = (symbol) => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:5000/prices/' + symbol)
            .then(response => {
                var prices = response.data.map(item => [item.date, item.close]);
                resolve(prices);
            })
            .catch(error => { 
                console.log(error); 
                reject(error);
            })
    })
}

class StockPriceChart extends Component {

    componentDidMount() {
        this.props.symbols.forEach((symbol) => {

            this.props.onLoading();

            getData(symbol).then((prices) => {
                let newSeries = { name: symbol, data: prices }
                this.setState(prevState => ({
                    series: [...prevState ? prevState.series : [], newSeries]
                }))
            }).catch(() => {

            }).then(() => {
                this.props.onLoaded();
            });
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.symbols !== prevProps.symbols) {

            // for new symbols, get the price data and add to the component's state
            this.props.symbols.forEach((symbol) => {
                if (prevProps.symbols.indexOf(symbol) === -1) {

                    this.props.onLoading();

                    getData(symbol).then((prices) => {
                        this.setState(prevState => ({
                            series: [...prevState.series, { name: symbol, data: prices }]
                        }));
                    }).catch(() => {

                    }).then(() => {
                        this.props.onLoaded();
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

        this.renderSeries();
    }

    renderSeries() {

        let chart = this.refs.chart.getChart();
        let stateSymbols = this.state.series.map((item) => item.name);
        let chartSymbols = chart.series.map((item) => item.name);

        // for each series in the state, make sure it's been added to the chart
        this.state.series.forEach(item => {
            if (chartSymbols.indexOf(item.name) === -1)
                chart.addSeries(item)
        })

        // remove series from the chart that arent in the state
        chart.series.forEach(item => {
            if (stateSymbols.indexOf(item.name) === -1)
                item.remove();
        })
    }

    render() {
        const options = getChartOptions();
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