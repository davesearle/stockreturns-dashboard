import * as Redux from "redux";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { combineReducers } from "redux";
import createTimeSeriesReducer from "../reducers/timeSeriesReducer";
import createReturnsReducer from "../reducers/returnsReducer";
import createPricesReducer from "../reducers/pricesReducer";
import createAppReducer from "../reducers/appReducer";
import loadingReducer from "../reducers/loadingReducer";

const rootReducer = combineReducers({
  app: createAppReducer(),
  returns: createReturnsReducer(),
  prices: createPricesReducer(),
  pricesTimeSeries: createTimeSeriesReducer("pricesTimeSeries"),
  returnsTimeSeries: createTimeSeriesReducer("returnsTimeSeries"),
  loading: loadingReducer
});

const store = Redux.createStore(rootReducer, applyMiddleware(thunk));

export default store;
