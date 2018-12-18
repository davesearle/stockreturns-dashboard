import React, { Component } from 'react';
import AutoComplete from '../common/AutoComplete'
import { connect } from 'react-redux'
import axios from 'axios'

const getStocks = (inputValue, callback) => {

    axios.get('http://localhost:5000/tickers/' + (inputValue ? inputValue : ''))
        .then(response => {

            var stocks = response.data.map(suggestion => ({
                value: suggestion.Symbol,
                label: suggestion.Symbol + ' ' + suggestion.Name
            }))

            callback(stocks);
        })
        .catch(error => { console.log(error); })
        .then(() => { });
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
    onSymbolsSelected: (symbols) => {
        dispatch({ type: 'SYMBOLS_SELECTED', symbols })
    }
})

class StockPicker extends Component {

    handleChange = (symbols) => {
        this.props.onSymbolsSelected(symbols.map(symbol => symbol.value));
    };

    render() {
        return (
            <AutoComplete
                placeholder="Select multiple stocks"
                suggestions={getStocks}
                onChange={this.handleChange}
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockPicker);