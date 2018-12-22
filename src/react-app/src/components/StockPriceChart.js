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
                lineWidth: 1.5,
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        enabled: false
                    }
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
    symbols: state.symbols,
    colours: state.colours,
    startDate: state.startDate,
    endDate: state.endDate
})

const mapDispatchToProps = (dispatch) => ({
    onLoading: () => {
        dispatch({ type: 'FETCHING_START' })
    },
    onLoaded: () => {
        dispatch({ type: 'FETCHING_END' })
    }
})

const getData = (symbol, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:5000/prices/' + symbol + "/" + startDate + "/" + endDate)
            .then(response => {
                var data = response.data.map(item => [item.date, item.close]);
                resolve(data);
            })
            .catch(error => { 
                console.log(error); 
                reject(error);
            })
    })
}
const getColour = (colours, symbol) => {
    var colourCode = colours.filter((colour) => colour.symbol === symbol)[0].colour;
    return colourCode;
}

class StockPriceChart extends Component {

    async loadSeries(symbols, startDate, endDate, reload) {
        this.props.onLoading();
        var tasks = symbols.map((symbol) => {
            return getData(symbol, startDate, endDate).then(data => {
                if(reload) {
                    let chart = this.refs.chart.getChart();
                    chart.series.forEach(item => {
                        if (item.name === symbol)
                            item.remove();
                    })
                }
                let newSeries = { 
                    name: symbol, 
                    data: data, 
                    color: getColour(this.props.colours, symbol) 
                }
                this.setState(prevState => ({
                    series: [...prevState 
                        ? (reload 
                            ? prevState.series.filter((item) => item.name !== symbol) 
                            : prevState.series) 
                        : [], newSeries]
                }))
            })
        });

        await Promise.all(tasks).then(() => {
            this.props.onLoaded();
        }).catch((error) => {
            this.props.onLoaded();
        });
    }

    async componentDidMount() {
        await this.loadSeries(this.props.symbols, this.props.startDate, this.props.endDate);
    }

    async componentDidUpdate(prevProps) {

        if(this.props.startDate !== prevProps.startDate || 
            this.props.endDate !== prevProps.endDate) 
        {
            await this.loadSeries(this.props.symbols, this.props.startDate, this.props.endDate, true);
        }

        if (this.props.symbols !== prevProps.symbols) {

            let seriesToLoad = this.props.symbols.filter((symbol) => prevProps.symbols.indexOf(symbol) === -1);
            let seriesToDelete = prevProps.symbols.filter((symbol) => this.props.symbols.indexOf(symbol) === -1);

            await this.loadSeries(seriesToLoad, this.props.startDate, this.props.endDate);
            this.deleteSeries(seriesToDelete)
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