import axios from "axios";
import { fetchSeries } from "./timeSeriesActions";
export const FETCH_PRICES_METRICS_BEGIN = "FETCH_PRICES_METRICS_BEGIN";
export const FETCH_PRICES_METRICS_SUCCESS = "FETCH_PRICES_METRICS_SUCCESS";
export const FETCH_PRICES_METRICS_FAILURE = "FETCH_PRICES_METRICS_FAILURE";
export const UPDATE_PRICES_METRICS = "UPDATE_PRICES_METRICS";

export const fetchPricesTimeSeries = fetchSeries.bind(
  null,
  "pricesTimeSeries",
  (symbol, startDate, endDate) => {
    return "/prices/timeseries/" + symbol + "/" + startDate + "/" + endDate;
  },
  response => {
    return response.data.map(item => [item.date, item.close]);
  }
);

export const fetchPricesMetricsBegin = () => ({
  type: FETCH_PRICES_METRICS_BEGIN
});
export const fetchPricesMetricsSuccess = () => ({
  type: FETCH_PRICES_METRICS_SUCCESS
});
export const fetchPricesMetricsFailure = () => ({
  type: FETCH_PRICES_METRICS_FAILURE
});
export const updatePricesMetrics = metrics => ({
  type: UPDATE_PRICES_METRICS,
  payload: { metrics }
});
export const fetchPricesMetrics = (symbols, selectedDate) => {
  return dispatch => {
    dispatch(fetchPricesMetricsBegin());

    const tasks = symbols.map(symbol => {
      return axios
        .get("/prices/metrics/" + symbol + "/" + selectedDate)
        .then(response => {
          var metrics = response.data[0];
          dispatch(updatePricesMetrics(metrics));
        })
        .catch(error => {
          console.log(error);
        });
    });

    Promise.all(tasks)
      .then(() => {
        dispatch(fetchPricesMetricsSuccess());
      })
      .catch(() => {
        dispatch(fetchPricesMetricsFailure());
      });
  };
};
