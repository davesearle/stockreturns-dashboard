import axios from "axios";
import { fetchSeries } from "./timeSeriesActions";
export const FETCH_RETURNS_METRICS_BEGIN = "FETCH_RETURNS_METRICS_BEGIN";
export const FETCH_RETURNS_METRICS_SUCCESS = "FETCH_RETURNS_METRICS_SUCCESS";
export const FETCH_RETURNS_METRICS_FAILURE = "FETCH_RETURNS_METRICS_FAILURE";
export const UPDATE_RETURNS_METRICS = "UPDATE_RETURNS_METRICS";

export const fetchReturnsTimeSeries = fetchSeries.bind(
  null,
  "returnsTimeSeries",
  (symbol, startDate, endDate) => {
    return (
      "/api/returns/timeseries/" + symbol + "/" + startDate + "/" + endDate
    );
  },
  response => {
    return response.data.map(item => [item.date, item.return]);
  }
);

export const fetchReturnsMetricsBegin = (startDate, endDate) => ({
  type: FETCH_RETURNS_METRICS_BEGIN,
  payload: {
    startDate: startDate,
    endDate: endDate
  }
});
export const fetchReturnsMetricsSuccess = () => ({
  type: FETCH_RETURNS_METRICS_SUCCESS
});
export const fetchReturnsMetricsFailure = () => ({
  type: FETCH_RETURNS_METRICS_FAILURE
});
export const updateReturnsMetrics = metrics => ({
  type: UPDATE_RETURNS_METRICS,
  payload: { metrics }
});
export const fetchReturnsMetrics = (symbols, startDate, endDate) => {
  return (dispatch, getState) => {
    const state = getState().returns;
    if (state.startDate === startDate && state.endDate === endDate) return;

    dispatch(fetchReturnsMetricsBegin(startDate, endDate));

    const tasks = symbols.map(symbol => {
      return axios
        .get("/api/returns/metrics/" + symbol + "/" + startDate + "/" + endDate)
        .then(response => {
          let metrics = response.data[0];
          dispatch(updateReturnsMetrics(metrics));
        })
        .catch(error => {
          console.log(error);
        });
    });

    Promise.all(tasks)
      .then(() => {
        dispatch(fetchReturnsMetricsSuccess());
      })
      .catch(() => {
        dispatch(fetchReturnsMetricsFailure());
      });
  };
};
