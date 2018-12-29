import * as Redux from "redux";
import seriesColours from "../common/seriesColours";

const getInitialState = () => {
  var symbols = ["AAPL", "MSFT", "NFLX", "GOOG", "AMZN"];
  return {
    symbols: symbols,
    colours: assignColors([], symbols),
    startDate: "2018-01-01",
    endDate: new Date().toISOString().slice(0, 10)
  };
};

const reducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case "FETCHING_START":
      return Object.assign({}, state, { isLoading: true });
    case "FETCHING_END":
      return Object.assign({}, state, { isLoading: false });
    case "SYMBOLS_SELECTED":
      return Object.assign({}, state, {
        symbols: action.symbols,
        colours: assignColors(state.colours, action.symbols)
      });
    case "DATE_RANGE_SELECTED":
      return Object.assign({}, state, {
        startDate: action.startDate,
        endDate: action.endDate
      });
    case "DATE_RANGE_RESET":
      return Object.assign({}, state, {
        startDate: "2018-01-01",
        endDate: new Date().toISOString().slice(0, 10)
      });
    default:
      return state;
  }
};

const assignColors = (currentMap, symbols) => {
  var colourMap = [];

  currentMap.forEach(item => {
    if (symbols.indexOf(item.symbol) !== -1) colourMap.push(item);
  });

  var currentSymbolsInMap = colourMap.map(item => item.symbol);

  symbols.forEach(symbol => {
    if (currentSymbolsInMap.indexOf(symbol) === -1) {
      var currentColoursInUse = colourMap.map(item => item.colour);
      var colour = seriesColours.filter(
        colour => currentColoursInUse.indexOf(colour) === -1
      )[0];

      colourMap.push({ symbol: symbol, colour: colour });
    }
  });

  return colourMap;
};

const store = Redux.createStore(reducer);

export default store;
