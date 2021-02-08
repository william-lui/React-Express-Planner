import * as ActionTypes from "./ActionTypes";
import { baseUrl } from "../shared/baseUrl";
import { APP_KEY, APP_ID } from "../config";

const verifyResponse = (response) => {
  if (response.ok) {
    return response;
  } else {
    var error = new Error(
      "Error " + response.status + ": " + response.statusText
    );
    error.response = response;
    throw error;
  }
};

const throwError = (error) => {
  var errmess = new Error(error.message);
  throw errmess;
};

const post = (endpoint, write) => {
  return fetch(baseUrl + endpoint, {
    method: "POST",
    body: JSON.stringify(write),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });
};

const getNResult = (arr, n) => {
  let result = [];
  for (let index = 0; index < n; index++) {
    let randIndex = parseInt(Math.random() * arr.length, 10);
    let randElement = arr.splice(randIndex, 1)[0];
    result.push(randElement);
  }
  return result;
};

export const addComment = (comment) => ({
  type: ActionTypes.ADD_COMMENT,
  payload: comment,
});

export const postComment = (dishId, rating, comment) => (dispatch) => {
  const newComment = {
    dish: dishId,
    rating: rating,
    comment: comment,
  };
  console.log("Comment ", newComment);

  const bearer = "Bearer " + localStorage.getItem("token");

  return fetch(baseUrl + "comments", {
    method: "POST",
    body: JSON.stringify(newComment),
    headers: {
      "Content-Type": "application/json",
      Authorization: bearer,
    },
    credentials: "same-origin",
  })
    .then(verifyResponse, throwError)
    .then((response) => response.json())
    .then((response) => dispatch(addComment(response)))
    .catch((error) => {
      console.log("Post comments ", error.message);
      alert("Your comment could not be posted\nError: " + error.message);
    });
};

export const fetchDishes = (dishQuery) => (dispatch) => {
  dispatch(dishesLoading());

  return fetch(
    `https://api.edamam.com/search?q=${dishQuery}&app_id=${APP_ID}&app_key=${APP_KEY}`
  )
    .then(verifyResponse, throwError)
    .then((response) => response.json())
    .then((dishes) => {
      console.log(dishes.hits);
      dispatch(addDishes(dishes.hits));
    })
    .catch((error) => dispatch(dishesFailed(error.message)));
};

export const dishesLoading = () => ({
  type: ActionTypes.DISHES_LOADING,
});

export const dishesFailed = (errmess) => ({
  type: ActionTypes.DISHES_FAILED,
  payload: errmess,
});

export const addDishes = (dishes) => ({
  type: ActionTypes.ADD_DISHES,
  payload: dishes,
});

export const fetchComments = () => (dispatch) => {
  return fetch(baseUrl + "comments")
    .then(verifyResponse, throwError)
    .then((response) => response.json())
    .then((comments) => dispatch(addComments(comments)))
    .catch((error) => dispatch(commentsFailed(error.message)));
};

export const commentsFailed = (errmess) => ({
  type: ActionTypes.COMMENTS_FAILED,
  payload: errmess,
});

export const addComments = (comments) => ({
  type: ActionTypes.ADD_COMMENTS,
  payload: comments,
});

export const fetchPromos = () => (dispatch) => {
  dispatch(promosLoading());

  return fetch(baseUrl + "promotions")
    .then(verifyResponse, throwError)
    .then((response) => response.json())
    .then((promos) => {
      if (promos.length === 0) {
        fetch(
          `https://api.edamam.com/search?q=chicken-breast&app_id=${APP_ID}&app_key=${APP_KEY}`
        )
          .then(verifyResponse, throwError)
          .then((response) => response.json())
          .then((promos) => {
            post("promotions", getNResult(promos.hits, 5))
              .then(verifyResponse, throwError)
              .catch((err) => dispatch(promosFailed(err)));
          })
          .catch((err) => dispatch(promosFailed(err)));

        fetch(
          `https://api.edamam.com/search?q=lean-beef&app_id=${APP_ID}&app_key=${APP_KEY}`
        )
          .then(verifyResponse, throwError)
          .then((response) => response.json())
          .then((promos) => {
            post("promotions", getNResult(promos.hits, 5))
              .then(verifyResponse, throwError)
              .catch((err) => dispatch(promosFailed(err)));
          })
          .catch((err) => dispatch(promosFailed(err)));

        fetch(
          `https://api.edamam.com/search?q=whole-egg&app_id=${APP_ID}&app_key=${APP_KEY}`
        )
          .then(verifyResponse, throwError)
          .then((response) => response.json())
          .then((promos) => {
            post("promotions", getNResult(promos.hits, 5))
              .then(verifyResponse, throwError)
              .catch((err) => dispatch(promosFailed(err)));
          })
          .catch((err) => dispatch(promosFailed(err)));

        fetch(baseUrl + "promotions")
          .then(verifyResponse, throwError)
          .then((response) => response.json())
          .then((promos) => dispatch(addPromos(promos)))
          .catch((error) => dispatch(promosFailed(error)));
      } else {
        dispatch(addPromos(promos));
      }
    })
    .catch((error) => dispatch(promosFailed(error.message)));
};

export const promosLoading = () => ({
  type: ActionTypes.PROMOS_LOADING,
});

export const promosFailed = (errmess) => ({
  type: ActionTypes.PROMOS_FAILED,
  payload: errmess,
});

export const addPromos = (promos) => ({
  type: ActionTypes.ADD_PROMOS,
  payload: promos,
});

export const fetchLeaders = () => (dispatch) => {
  dispatch(leadersLoading());

  return fetch(baseUrl + "leaders")
    .then(verifyResponse, throwError)
    .then((response) => {
      return response.json();
    })
    .then((leaders) => dispatch(addLeaders(leaders)))
    .catch((error) => dispatch(leadersFailed(error.message)));
};

export const leadersLoading = () => ({
  type: ActionTypes.LEADERS_LOADING,
});

export const leadersFailed = (errmess) => ({
  type: ActionTypes.LEADERS_FAILED,
  payload: errmess,
});

export const addLeaders = (leaders) => ({
  type: ActionTypes.ADD_LEADERS,
  payload: leaders,
});

export const postFeedback = (feedback) => (dispatch) => {
  return fetch(baseUrl + "feedback", {
    method: "POST",
    body: JSON.stringify(feedback),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  })
    .then(verifyResponse, throwError)
    .then((response) => response.json())
    .then((response) => {
      console.log("Feedback", response);
      alert("Thank you for your feedback!\n" + JSON.stringify(response));
    })
    .catch((error) => {
      console.log("Feedback", error.message);
      alert("Your feedback could not be posted\nError: " + error.message);
    });
};

export const requestLogin = (creds) => {
  return {
    type: ActionTypes.LOGIN_REQUEST,
    creds,
  };
};

export const receiveLogin = (response) => {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    token: response.token,
  };
};

export const loginError = (message) => {
  return {
    type: ActionTypes.LOGIN_FAILURE,
    message,
  };
};

export const loginUser = (creds) => (dispatch) => {
  // We dispatch requestLogin to kickoff the call to the API
  dispatch(requestLogin(creds));

  return fetch(baseUrl + "users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
  })
    .then(verifyResponse, throwError)
    .then((response) => response.json())
    .then((response) => {
      if (response.success) {
        // If login was successful, set the token in local storage
        localStorage.setItem("token", response.token);
        localStorage.setItem("creds", JSON.stringify(creds));
        // Dispatch the success action
        dispatch(fetchFavorites());
        dispatch(receiveLogin(response));
      } else {
        var error = new Error("Error " + response.status);
        error.response = response;
        throw error;
      }
    })
    .catch((error) => dispatch(loginError(error.message)));
};

export const requestLogout = () => {
  return {
    type: ActionTypes.LOGOUT_REQUEST,
  };
};

export const receiveLogout = () => {
  return {
    type: ActionTypes.LOGOUT_SUCCESS,
  };
};

// Logs the user out
export const logoutUser = () => (dispatch) => {
  dispatch(requestLogout());
  localStorage.removeItem("token");
  localStorage.removeItem("creds");
  dispatch(favoritesFailed("Error 401: Unauthorized"));
  dispatch(receiveLogout());
};

export const postFavorite = (dishId) => (dispatch) => {
  const bearer = "Bearer " + localStorage.getItem("token");

  return fetch(baseUrl + "favorites/" + dishId, {
    method: "POST",
    body: JSON.stringify({ _id: dishId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: bearer,
    },
    credentials: "same-origin",
  })
    .then(verifyResponse, throwError)
    .then((response) => response.json())
    .then((favorites) => {
      console.log("Favorite Added", favorites);
      dispatch(addFavorites(favorites));
    })
    .catch((error) => dispatch(favoritesFailed(error.message)));
};

export const deleteFavorite = (dishId) => (dispatch) => {
  const bearer = "Bearer " + localStorage.getItem("token");

  return fetch(baseUrl + "favorites/" + dishId, {
    method: "DELETE",
    headers: {
      Authorization: bearer,
    },
    credentials: "same-origin",
  })
    .then(verifyResponse, throwError)
    .then((response) => response.json())
    .then((favorites) => {
      console.log("Favorite Deleted", favorites);
      dispatch(addFavorites(favorites));
    })
    .catch((error) => dispatch(favoritesFailed(error.message)));
};

export const fetchFavorites = () => (dispatch) => {
  dispatch(favoritesLoading());

  const bearer = "Bearer " + localStorage.getItem("token");

  return fetch(baseUrl + "favorites", {
    headers: {
      Authorization: bearer,
    },
  })
    .then(verifyResponse, throwError)
    .then((response) => response.json())
    .then((favorites) => dispatch(addFavorites(favorites)))
    .catch((error) => dispatch(favoritesFailed(error.message)));
};

export const favoritesLoading = () => ({
  type: ActionTypes.FAVORITES_LOADING,
});

export const favoritesFailed = (errmess) => ({
  type: ActionTypes.FAVORITES_FAILED,
  payload: errmess,
});

export const addFavorites = (favorites) => ({
  type: ActionTypes.ADD_FAVORITES,
  payload: favorites,
});

export const fetchQuotes = () => (dispatch) => {
  dispatch(quotesLoading());

  return fetch(baseUrl + "quotes/featured")
    .then(verifyResponse, throwError)
    .then((response) => response.json())
    .then((quote) => {
      let lastUpdateDate = new Date(Date.parse(quote.updatedAt));
      let todayDate = new Date();

      if (lastUpdateDate.getDay() !== todayDate.getDay()) {
        return dispatch(updateQuote());
      }
      return dispatch(addQuotes(quote));
    })
    .catch((err) => dispatch(quotesFailed(err.message)));
};

export const updateQuote = () => (dispatch) => {
  return fetch(baseUrl + "quotes")
    .then(verifyResponse, throwError)
    .then((response) => response.json())
    .then((quotes) => {
      const featuredQuote = quotes[parseInt(Math.random() * quotes.length, 10)];
      return fetch(baseUrl + "quotes/featured", {
        method: "PUT",
        body: JSON.stringify({
          featuredQuote: featuredQuote.quote,
          featuredAuthor: featuredQuote.author,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      })
        .then(verifyResponse, (err) => {
          let errmess = new Error(err.message);
          throw errmess;
        })
        .then((response) => response.json())
        .then((quote) => {
          console.log(quote);
          return dispatch(addQuotes(quote));
        })
        .catch((err) => dispatch(quotesFailed(err.message)));
    })
    .catch((err) => dispatch(quotesFailed(err.message)));
};
export const quotesLoading = () => ({ type: ActionTypes.QUOTES_LOADING });

export const quotesFailed = (errmess) => ({
  type: ActionTypes.QUOTES_FAILED,
  payload: errmess,
});

export const addQuotes = (quote) => ({
  type: ActionTypes.ADD_QUOTE,
  payload: quote,
});
