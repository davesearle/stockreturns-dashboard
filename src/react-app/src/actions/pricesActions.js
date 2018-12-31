import { fetchSeries } from "./timeSeriesActions";

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
