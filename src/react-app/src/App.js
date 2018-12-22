import React, { Component } from 'react';
import StockPicker from './components/StockPicker'
import StockPriceChart from './components/StockPriceChart'
import StockVolumeChart from './components/StockVolumeChart'
import StockReturnChart from './components/StockReturnChart'
import Paper from '@material-ui/core/Paper';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import './App.css';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LoadingIndicator from './components/LoadingIndicator';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { colors } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgb(49, 56, 71)'
        },
        secondary: {
            main: '#a58100',
        },
    },
});
const drawerWidth = 240;
const styles = theme => ({
    appBarRoot: {
       
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    root: {
        display: 'flex',
        flexGrow: 1
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        top: 'auto',
        zIndex:0,
        marginTop:2,
        top:150,
        boxShadow:'12px -24px 32px -22px rgba(0,0,0,0.75)'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        display: 'flex'
    },
    stockPicker: {
        padding: 0,
    },
    stockPickerPaper: {

        padding:theme.spacing.unit * 2,
        position: 'fixed',
        width: '100%',
        zIndex: 100,
        position:'relative'
    },
    toolbar: theme.mixins.toolbar
});

const chartColours = [
    '#003f5c',
    '#ff7c43',
    '#d45087',
    '#2f4b7c',
    '#ffa600',
    '#665191',
    '#a05195',
    '#f95d6a',
]

const assignColors = (currentMap, symbols) => {

    var colourMap = [];
    var newMap = [];

    currentMap.forEach((item) => {
        if(symbols.indexOf(item.symbol) !== -1)
            colourMap.push(item);
    })

    var currentSymbolsInMap = colourMap.map((item) => item.symbol);

    symbols.forEach((symbol) => {
        
        if(currentSymbolsInMap.indexOf(symbol) === -1) {

            var currentColoursInUse = colourMap.map((item) => item.colour);
            var colour = chartColours.filter((colour) => currentColoursInUse.indexOf(colour) === -1)[0];

            colourMap.push({ symbol: symbol, colour: colour});
        }
    })

    return colourMap;
}

const getInitialState = () => {
    var symbols = ['AAPL', 'MSFT', 'NFLX', 'GOOG', 'AMZN'];
    return { 
        symbols: symbols, 
        colours: assignColors([], symbols) 
    }
}

const reducer = (state = getInitialState(), action) => {

    switch (action.type) {
        case 'FETCHING_START':
            return Object.assign({}, state, { isLoading: true }); 
        case 'FETCHING_END':
            return Object.assign({}, state, { isLoading: false }); 
        case 'SYMBOLS_SELECTED':
            return Object.assign({}, state, { symbols: action.symbols, colours: assignColors(state.colours, action.symbols) });
        default:
            return state;
    }
}

const menuItems = [
    { 
        text: 'Closing prices',
        url: '/'
    }, { 
        text: 'Returns',
        url: '/returns'
    }]

const store = Redux.createStore(reducer);

class App extends Component {

    render() {

        const { classes } = this.props;

        return (
            <BrowserRouter>
                <MuiThemeProvider theme={theme}>
                    <ReactRedux.Provider store={store} >
                        <div className={classes.appBarRoot}>
                            <CssBaseline />
                            <AppBar className={classes.appBar} position="static">
                                <Toolbar>
                                    <Typography variant="h6" color="inherit" noWrap>
                                        Stock returns
                                    </Typography>
                                </Toolbar>
                            </AppBar>
                        </div>
                        <LoadingIndicator />
                        <div className={classes.stockPicker}>
                            <Paper elevation={1} className={classes.stockPickerPaper}>
                                <StockPicker />
                            </Paper>
                        </div>
                        
                        <div className={classes.root}>
                            <Drawer
                                className={classes.drawer}
                                variant="permanent"
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                            >
                                <List>
                                    {menuItems.map((item, index) => (
                                        <div key={item.text}>
                                            <ListItem button component={Link} to={item.url}>
                                                <ListItemText>{item.text}</ListItemText>
                                            </ListItem>
                                            <Divider />
                                        </div>
                                    ))}
                                </List>

                            </Drawer>
                            <main className={classes.content}>
                                <Route exact path="/" component={StockPriceChart} />
                                <Route exact path="/volume" component={StockVolumeChart} />
                                <Route exact path="/returns" component={StockReturnChart} />
                            </main>
                        </div>
                    </ReactRedux.Provider>
                </MuiThemeProvider>
            </BrowserRouter>
        );
    }
}

export default withStyles(styles, { withTheme: true })(App);

