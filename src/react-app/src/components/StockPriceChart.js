import React, { Component } from "react";
import ReactHighcharts from 'react-highcharts';
import axios from 'axios'
import { connect } from 'react-redux'

const getOptions = () => {
    return {
        title: {
            text: 'Closing prices'
        }
    }
}

const mapStateToProps = (state) => ({
    symbols: state.symbols
})

const mapDispatchToProps = (dispatch) => ({
})

class StockPriceChart extends Component {

    getData = (symbol, callback) => {
        axios.get('http://localhost:5000/prices/' + symbol)
            .then(response => {
    
                var prices = Array.from(response.data.map(suggestion => suggestion.Close));

                callback(prices);
            })
            .catch(error => { console.log(error); })
            .then(() => {  });
    }

    findSeriesIndex(symbol) {
        let chart = this.refs.chart.getChart();
        let seriesLength = chart.series.length;

        for(var i = 0; i < seriesLength; i++)
        {
            if(chart.series[i].name === symbol)
                return i;
        }
        return -1;
    }

    removeSeries(symbol) {
        let chart = this.refs.chart.getChart();
        var seriesIndex = this.findSeriesIndex(symbol);
        if(seriesIndex > -1)
            chart.series[seriesIndex].remove();
    }

    addSeries(symbol, prices) {
        let chart = this.refs.chart.getChart();
        chart.addSeries({
            name: symbol,
            data: prices
        });
    }

    componentDidUpdate(prevProps) {

        if (this.props.symbols !== prevProps.symbols) {

            prevProps.symbols.forEach((symbol) => {
                if(this.props.symbols.indexOf(symbol) === -1) {
                    this.removeSeries(symbol);
                }
            });
       
            this.props.symbols.forEach((symbol) => {
                var seriesIndex = this.findSeriesIndex(symbol);
                if(seriesIndex === -1) {
                    this.getData(symbol, (prices) => {
                        this.addSeries(symbol, prices);
                    });
                }
            });
        }
    }

    render() {
        const options = getOptions();

        return (
            <ReactHighcharts 
                ref="chart"
                config={options}
                isPureConfig 
                neverReflow 
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockPriceChart);