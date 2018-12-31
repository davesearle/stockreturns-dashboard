const loadingReducer = (state = {}, action) => {
  const { type } = action;
  const matches = /(.*)_(BEGIN|SUCCESS|FAILURE)/.exec(type);

  // not a *_BEGIN / *_SUCCESS /  *_FAILURE actions, so we ignore them
  if (!matches) return state;

  const [, requestName, requestState] = matches;
  return {
    ...state,
    // Store whether a request is happening at the moment or not
    // e.g. will be true when receiving GET_TODOS_BEGIN
    //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
    [requestName]: requestState === "BEGIN"
  };
};

export default loadingReducer;
