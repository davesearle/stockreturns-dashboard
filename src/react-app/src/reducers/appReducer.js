import seriesColours from "../helpers/seriesColours";

import {
  SYMBOLS_SELECTED,
  DATE_RANGE_SELECTED,
  DATE_SELECTED,
  DATE_RANGE_RESET
} from "../actions/appActions";

export default function createAppReducer() {
  const initialState = () => {
    var symbols = ["AAPL", "MSFT", "NFLX", "GOOG", "AMZN"];
    return {
      symbols: symbols,
      colours: assignColors([], symbols),
      startDate: "2018-01-01",
      endDate: new Date().toISOString().slice(0, 10),
      selectedDate: null
    };
  };

  return function reducer(state = initialState(), action) {
    switch (action.type) {
      case SYMBOLS_SELECTED:
        return Object.assign({}, state, {
          symbols: action.payload.symbols,
          colours: assignColors(state.colours, action.payload.symbols)
        });
      case DATE_RANGE_SELECTED:
        return Object.assign({}, state, {
          startDate: action.payload.startDate,
          endDate: action.payload.endDate
        });
      case DATE_RANGE_RESET:
        return Object.assign({}, state, {
          startDate: "2018-01-01",
          endDate: new Date().toISOString().slice(0, 10)
        });
      case DATE_SELECTED:
        return Object.assign({}, state, {
          selectedDate: action.payload.selectedDate
        });
      default:
        return state;
    }
  };
}

const assignColors = (currentMap, symbols) => {
  let colourMap = [];

  currentMap.forEach(item => {
    if (symbols.indexOf(item.symbol) !== -1) colourMap.push(item);
  });

  var currentSymbolsInMap = colourMap.map(item => item.symbol);

  symbols.forEach(symbol => {
    if (currentSymbolsInMap.indexOf(symbol) === -1) {
      const currentColoursInUse = colourMap.map(item => item.colour);
      const colour = seriesColours.filter(
        colour => currentColoursInUse.indexOf(colour) === -1
      )[0];

      colourMap.push({ symbol: symbol, colour: colour });
    }
  });

  return colourMap;
};
