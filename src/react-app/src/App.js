import React, { Component } from 'react';
import StockPicker from './components/StockPicker'
import StockPriceChart from './components/StockPriceChart'
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import './App.css';

const reducer = (state = { symbols: [] }, action) => {

    switch(action.type) {
        case 'SYMBOLS_SELECTED':
            return Object.assign({}, state, {
                symbols: action.symbols
            });
        default:
            return state;
    }
}

let store = Redux.createStore(reducer);

class App extends Component {
    
    render() {
      return (
        <ReactRedux.Provider store={store}>
            <StockPicker />
            <StockPriceChart />
        </ReactRedux.Provider>
      );
    }
}

export default App;
