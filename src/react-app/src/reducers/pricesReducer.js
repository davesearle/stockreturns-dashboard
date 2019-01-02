import {
  UPDATE_PRICES_METRICS,
  FETCH_PRICES_METRICS_BEGIN,
  FETCH_PRICES_METRICS_FAILURE
} from "../actions/pricesActions";

export default function createPricesReducer() {
  const initialState = () => {
    return {
      metrics: [],
      selectedDate: null
    };
  };

  return function reducer(state = initialState(), action) {
    switch (action.type) {
      case FETCH_PRICES_METRICS_BEGIN:
        return {
          ...state,
          selectedDate: action.payload.selectedDate
        };
      case FETCH_PRICES_METRICS_FAILURE:
        return {
          ...state,
          selectedDate: null
        };
      case UPDATE_PRICES_METRICS:
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
