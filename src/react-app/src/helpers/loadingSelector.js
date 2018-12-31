export const createLoadingSelector = actions => state =>
  actions.some(action => state.loading[action]);
