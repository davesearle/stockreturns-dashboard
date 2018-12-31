import React, { Component } from "react";
import StockPickerContainer from "./containers/StockPickerContainer";
import StockPricesContainer from "./containers/StockPricesContainer";
import StockReturnsContainer from "./containers/StockReturnsContainer";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LoadingIndicator from "./components/LoadingIndicator";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import * as ReactRedux from "react-redux";
import "./App.css";
import store from "./store";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#313847"
    },
    secondary: {
      main: "#a58100"
    }
  },
  typography: {
    useNextVariants: true
  }
});
const drawerWidth = 240;
const styles = theme => ({
  appBarRoot: {},
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  root: {
    display: "flex",
    flexGrow: 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    zIndex: 0,
    marginTop: 0,
    top: "auto",
    boxShadow: "12px -24px 32px -22px rgba(0,0,0,0.75)"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    display: "flex"
  },
  stockPicker: {
    padding: 0
  },
  stockPickerPaper: {
    padding: theme.spacing.unit * 2,
    width: "100%",
    zIndex: 100,
    position: "relative"
  },
  toolbar: theme.mixins.toolbar
});

const menuItems = [
  {
    text: "Returns",
    url: "/"
  },
  {
    text: "Closing prices",
    url: "/closing-prices"
  }
];

class App extends Component {
  render() {
    const { classes } = this.props;

    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <ReactRedux.Provider store={store}>
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
                <StockPickerContainer />
              </Paper>
            </div>

            <div className={classes.root}>
              <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                  paper: classes.drawerPaper
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
                <Route exact path="/" component={StockReturnsContainer} />
                <Route
                  exact
                  path="/closing-prices"
                  component={StockPricesContainer}
                />
              </main>
            </div>
          </ReactRedux.Provider>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
