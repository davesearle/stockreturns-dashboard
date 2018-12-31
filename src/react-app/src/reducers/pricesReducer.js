import { UPDATE_PRICES_METRICS } from "../actions/pricesActions";

export default function createPricesReducer() {
  const initialState = () => {
    return {
      metrics: []
    };
  };

  return function reducer(state = initialState(), action) {
    switch (action.type) {
      case UPDATE_PRICES_METRICS:
        let metrics = action.payload.metrics;
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
