import * as ActionTypes from "./ActionTypes";

export const Quotes = (
  state = { isLoading: false, errmess: null, quote: {} },
  action
) => {
  switch (action.type) {
    case ActionTypes.QUOTES_LOADING:
      return { isLoading: true, errmess: null, quote: {} };

    case ActionTypes.ADD_QUOTE:
      return { ...state, isLoading: false, quote: action.payload };

    case ActionTypes.QUOTES_FAILED:
      return { ...state, isLoading: false, errmess: action.payload };

    default:
      return state;
  }
};
