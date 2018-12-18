import React, { Component } from "react";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios'
import { connect } from 'react-redux'

const getOptions = (data) => ({
    title: {
        text: 'My chart'
    },
    series: [{
        data: data
    }]
});

const mapStateToProps = (state) => ({
    symbols: state.symbols
})

const mapDispatchToProps = (dispatch) => ({
})

class StockPriceChart extends Component {

    state = {
        prices: []
    }

    getData = (symbol) => {
        axios.get('http://localhost:5000/prices/' + symbol)
            .then(response => {
    
                var prices = Array.from(response.data.map(suggestion => suggestion.Close));
                
                this.setState({
                    prices: prices
                });
            })
            .catch(error => { console.log(error); })
            .then(() => {  });
    }

    componentDidUpdate(prevProps) {
        if (this.props.symbols !== prevProps.symbols) {
            this.getData(this.props.symbols[0]);
        }
    }

    render() {
        const prices = this.state.prices;
        const options = getOptions(prices);

        return (
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockPriceChart);