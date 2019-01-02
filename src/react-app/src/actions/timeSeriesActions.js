import axios from "axios";
export const FETCH_SERIES_BEGIN = "FETCH_SERIES_BEGIN";
export const FETCH_SERIES_SUCCESS = "FETCH_SERIES_SUCCESS";
export const FETCH_SERIES_FAILURE = "FETCH_SERIES_FAILURE";
export const ADD_SERIES = "ADD_SERIES";
export const UPDATE_SERIES = "UPDATE_SERIES";
export const REMOVE_SERIES = "REMOVE_SERIES";

export const fetchSeriesBegin = (type, startDate, endDate) => ({
  type: `${FETCH_SERIES_BEGIN}_${type}`,
  payload: {
    startDate: startDate,
    endDate: endDate
  }
});

export const fetchSeriesSuccess = type => ({
  type: `${FETCH_SERIES_SUCCESS}_${type}`
});

export const fetchSeriesFailure = (type, error) => ({
  type: `${FETCH_SERIES_FAILURE}_${type}`,
  payload: { error }
});

export const removeSeries = (type, name) => ({
  type: `${REMOVE_SERIES}_${type}`,
  payload: { name }
});
export const updateSeries = (type, series) => ({
  type: `${UPDATE_SERIES}_${type}`,
  payload: { series }
});
export const addSeries = (type, series) => ({
  type: `${ADD_SERIES}_${type}`,
  payload: { series }
});

export const fetchSeries = (
  type,
  createEndpoint,
  normaliseResponse,
  symbols,
  startDate,
  endDate,
  forceReload
) => {
  return (dispatch, getState) => {
    const state = getState()[type];

    let symbolsToLoad = symbols;
    let symbolsToRemove = [];

    if (state.series.length > 0) {
      const currentSymbols = state.series.map(item => item.name);
      symbolsToLoad = symbols.filter(s => currentSymbols.indexOf(s) === -1);
      symbolsToRemove = currentSymbols.filter(s => symbols.indexOf(s) === -1);

      if (forceReload) {
        // only force the reload if our state dates dont match our app dates
        const { app } = getState();
        if (
          app.startDate !== state.startDate ||
          app.endDate !== state.endDate
        ) {
          symbolsToLoad = symbols;
          symbolsToRemove = [];
        }
      }
    }

    if (symbolsToLoad.length > 0) {
      dispatch(fetchSeriesBegin(type, startDate, endDate));
    }

    const tasks = symbolsToLoad.map(symbol => {
      return axios
        .get(createEndpoint(symbol, startDate, endDate))
        .then(response => {
          let series = {
            name: symbol,
            data: normaliseResponse(response)
          };
          if (forceReload) {
            dispatch(updateSeries(type, series));
          } else {
            dispatch(addSeries(type, series));
          }
        })
        .catch(error => {
          console.log(error);
        });
    });

    Promise.all(tasks)
      .then(() => {
        dispatch(fetchSeriesSuccess(type));
      })
      .catch(() => {
        dispatch(fetchSeriesFailure(type));
      });

    symbolsToRemove.forEach(symbol => {
      dispatch(removeSeries(type, symbol));
    });
  };
};
