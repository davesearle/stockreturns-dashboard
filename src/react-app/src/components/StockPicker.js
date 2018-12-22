import React, { Component } from 'react';
import AutoComplete from './AutoComplete'
import { connect } from 'react-redux'
import axios from 'axios'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import DateRange from '@material-ui/icons/DateRange';

const searchTickers = (search) => {
    return new Promise((resolve, reject) => {
         axios.get('http://localhost:5000/tickers/search/' + (search ? search : ''))
        .then(response => {

            var tickers = response.data.map(ticker => ({
                value: ticker.symbol,
                label: ticker.name + " (" + ticker.symbol + ")"
            }))

            resolve(tickers);
        })
        .catch(error => { 
            console.log(error); 
            reject(error); 
        })
        .then(() => { });
    })
}

const getTicker = (symbol) => {
    return new Promise((resolve, reject) => {
         axios.get('http://localhost:5000/tickers/' + symbol)
        .then(response => {
            
            var ticker = response.data.map(ticker => ({
                value: ticker.symbol,
                label: ticker.name + " (" + ticker.symbol + ")"
            }))[0];

            resolve(ticker);
        })
        .catch(error => { 
            console.log(error); 
            reject(error); 
        })
        .then(() => { });
    })
}

const mapStateToProps = (state) => ({
    symbols: state.symbols,
    startDate: state.startDate,
    endDate: state.endDate
})

const mapDispatchToProps = (dispatch) => ({
    onSymbolsSelected: (symbols) => {
        dispatch({ type: 'SYMBOLS_SELECTED', symbols })
    }
})

const getTickers = async (symbols) => {
    var tasks = symbols.map((symbol) => {
        return getTicker(symbol).then(ticker => {
            return {
                value: ticker.value, label: ticker.label
            }
        })
    });
    return await Promise.all(tasks);
}

class StockPicker extends Component {

    state = {
        tickers: []
    }
    
    async componentDidMount() {
        var data = await getTickers(this.props.symbols);

        this.setState(() => ({
            tickers: data
        }))
    }

    handleChange = (symbols) => {
        this.setState(() => ({
            tickers: symbols.map(symbol => symbol)
        }))

        this.props.onSymbolsSelected(symbols.map(symbol => symbol.value));
    };

    handleLoadOptions = (inputValue, callback) => {
        searchTickers(inputValue).then(tickers => {
            callback(tickers);
        });
    }

    render() {
    
        return (
            <div style={{display:'flex',flexDirection:'row'}}>
                <div style={{flexGrow:1}}>
                    <AutoComplete
                        placeholder="Select multiple stocks"
                        loadOptions={this.handleLoadOptions}
                        onChange={this.handleChange}
                        value={this.state.tickers}
                        label="Stocks"
                    />

                </div>
                <div style={{minWidth:250,paddingLeft:10,flexGrow:0}}>
                    <TextField
                        id="outlined-read-only-input"
                        label="Date range"
                        style={{width:'100%'}}
                        value={this.props.startDate + " - " + this.props.endDate}
                        InputProps={{
                            readOnly: true,
                            startAdornment: (
                                <InputAdornment position="start">
                                  <DateRange />
                                </InputAdornment>
                              ),
                        }}
                        variant="outlined"
                    />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockPicker);
