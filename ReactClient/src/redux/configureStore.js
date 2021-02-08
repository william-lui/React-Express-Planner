import { createStore, combineReducers, applyMiddleware } from "redux";
import { createForms } from "react-redux-form";
import { Dishes } from "./dishes";
import { Comments } from "./comments";
import { Promotions } from "./promotions";
import { Leaders } from "./leaders";
import { favorites } from "./favorites";
import { Auth } from "./auth";
import { Quotes } from "./quotes";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { InitialFeedback, InitialFoodSearch } from "./forms";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      dishes: Dishes,
      comments: Comments,
      promotions: Promotions,
      leaders: Leaders,
      quote: Quotes,
      auth: Auth,
      favorites,
      ...createForms({
        feedback: InitialFeedback,
        foodSearch: InitialFoodSearch,
      }),
    }),
    applyMiddleware(thunk, logger)
  );

  return store;
};
