import {
  FETCH_SERIES_BEGIN,
  FETCH_SERIES_SUCCESS,
  FETCH_SERIES_FAILURE,
  ADD_SERIES,
  UPDATE_SERIES,
  REMOVE_SERIES
} from "../actions/timeSeriesActions";

export default function createTimeSeriesReducer(name) {
  const initialState = {
    series: [],
    startDate: null,
    endDate: null,
    loading: false,
    error: null
  };

  return function reducer(state = initialState, action) {
    switch (action.type) {
      case `${FETCH_SERIES_BEGIN}_${name}`:
        return {
          ...state,
          loading: true,
          error: null,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate
        };
      case `${FETCH_SERIES_SUCCESS}_${name}`:
        return {
          ...state,
          loading: false
        };
      case `${FETCH_SERIES_FAILURE}_${name}`:
        return {
          ...state,
          loading: false,
          error: action.payload.error,
          series: []
        };
      case `${ADD_SERIES}_${name}`:
        const newSeries = {
          name: action.payload.series.name,
          data: action.payload.series.data
        };
        return {
          ...state,
          loading: false,
          series: [...state.series, newSeries]
        };
      case `${UPDATE_SERIES}_${name}`:
        const updatedSeries = {
          name: action.payload.series.name,
          data: action.payload.series.data
        };
        return {
          ...state,
          series: [
            ...state.series.filter(
              item => item.name !== action.payload.series.name
            ),
            updatedSeries
          ]
        };
      case `${REMOVE_SERIES}_${name}`:
        return {
          ...state,
          series: [
            ...state.series.filter(item => item.name !== action.payload.name)
          ]
        };

      default:
        return state;
    }
  };
}
