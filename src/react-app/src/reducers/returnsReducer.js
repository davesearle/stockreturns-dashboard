import { UPDATE_RETURNS_METRICS } from "../actions/returnsActions";

export default function createReturnsReducer() {
  const initialState = () => {
    return {
      metrics: []
    };
  };

  return function reducer(state = initialState(), action) {
    switch (action.type) {
      case UPDATE_RETURNS_METRICS:
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
