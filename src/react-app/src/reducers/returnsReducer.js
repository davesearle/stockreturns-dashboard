import {
  UPDATE_RETURNS_METRICS,
  FETCH_RETURNS_METRICS_BEGIN,
  FETCH_RETURNS_METRICS_FAILURE
} from "../actions/returnsActions";

export default function createReturnsReducer() {
  const initialState = () => {
    return {
      metrics: [],
      startDate: null,
      endDate: null
    };
  };

  return function reducer(state = initialState(), action) {
    switch (action.type) {
      case FETCH_RETURNS_METRICS_BEGIN:
        return {
          ...state,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate
        };
      case FETCH_RETURNS_METRICS_FAILURE:
        return {
          ...state,
          startDate: null,
          endDate: null
        };
      case UPDATE_RETURNS_METRICS:
        const metrics = action.payload.metrics;
        return {
          ...state,
          metrics: [
            ...state.metrics.filter(item => item.symbol !== metrics.symbol),
            metrics
          ]
        };
      default:
        return state;
    }
  };
}
