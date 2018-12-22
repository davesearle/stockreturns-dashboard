import React, { Component } from "react";
import ReactHighcharts from 'react-highcharts';
import axios from 'axios'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import ExpandLess from '@material-ui/icons/ExpandLess';

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
                text: 'Returns'
            },
            labels: {
                format: '{value}%'
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
        flexDirection: 'row',
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
    colours: state.colours
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
        axios.get('http://localhost:5000/returns/' + symbol)
            .then(response => {
                var data = response.data.map(item => [item.date, item.return]);
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

class StockReturnChart extends Component {

    constructor(props) {
        super(props);
        this.sidePanel = React.createRef();
    }
    
    async componentDidMount() {
        this.props.onLoading();

        var tasks = this.props.symbols.map((symbol) => {
            return getData(symbol).then(returns => {
                let newSeries = { name: symbol, data: returns, color: getColour(this.props.colours, symbol) }
                this.setState(prevState => ({
                    series: [...prevState ? prevState.series : [], newSeries]
                }))
            })
        });

        await Promise.all(tasks).then(() => {
            this.props.onLoaded();
        }).catch((error) => {
            this.props.onLoaded();
        });
    }
    async componentDidUpdate(prevProps) {

        if (this.props.symbols !== prevProps.symbols) {
            this.props.onLoading();

            // for new symbols, get the price data and add to the component's state
            var tasks = this.props.symbols
                .filter((symbol) => prevProps.symbols.indexOf(symbol) === -1)
                .map((symbol) => {
                    return getData(symbol).then(returns => {
                        let newSeries = { name: symbol, data: returns, color: getColour(this.props.colours, symbol) }
                        this.setState(prevState => ({
                            series: [...prevState.series, newSeries]
                        }))
                    })
                }
            );
    
            await Promise.all(tasks)
                .then(() => { this.props.onLoaded(); })
                .catch((error) => { this.props.onLoaded(); });

            // for deleted symbols, remove them from the state
            prevProps.symbols
                .filter((symbol) => this.props.symbols.indexOf(symbol) === -1)
                .forEach((symbol) => {
                    this.setState(prevState => ({
                        series: prevState.series.filter((item, _) => item.name !== symbol)
                    }))
                }
            );
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

    handleClick() {
        this.sidePanel.current.style.width = '250px';
        this.sidePanel.current.style.padding = '10px';
        let chart = this.refs.chart.getChart();
        chart.reflow();
    }

    render() {
        const options = getChartOptions();
        const { classes } = this.props;
      
        return (
            <div className={classes.root}>
                <Typography variant="h5">
                    Returns
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                            Click a point on the chart for key statistics for that date
                            </Typography>
                <div style={{ height: 10 }}></div>
                <Paper elevation={1} className={classes.paper}>
                    <div style={{flexGrow:1,position:'relative'}}>
                        <div className={classes.chartContainer} onClick={this.handleClick.bind(this)}>
                            <ReactHighcharts
                                ref="chart"
                                config={options}
                                isPureConfig
                                neverReflow
                                domProps = {{className: classes.chart}}
                            />
                        </div>
                    </div>
                    <div style={{flexGrow:0,position:'relative',borderLeft:'1px solid #ccc',width:0,overflow:'hidden',backgroundColor:'#efefef'}} ref={this.sidePanel}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Microsoft
                            </Typography>
                            <Typography variant="h5" component="h2">
                            <ExpandLess />13% 
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                            since 2018-01-01
                            </Typography>
                        </CardContent>
                       
                        </Card>
                        <Card className={classes.card} style={{marginTop:10}}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Microsoft
                            </Typography>
                            <Typography variant="h5" component="h2">
                            <ExpandLess />13% 
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                            since 2018-01-01
                            </Typography>
                        </CardContent>
                       
                        </Card>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(StockReturnChart));


