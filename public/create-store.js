// Use a promise middleware solution to handle asynchronous action creators and
// do some nice real time updates on our UI (could also do some optimistic updates).

// https://github.com/reactjs/redux/issues/99
// Usage: https://github.com/erikras/react-redux-universal-hot-example

import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import promiseMiddleware from './middlewares/promise.middleware';

import * as reducers from './reducers/reducers';

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle, indent */
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
/* eslint-enable */

// The data parameter that we see here is used to initialize our Redux store with data. We didn't
// talk about this yet for simplicity but thanks to it your reducers can be initialized
// with real data if you already have some. For example in an isomorphic/universal app where you
// fetch data server-side, serialize and pass it to the client, your Redux store can be
// initialized with that data.
// We're not passing any data here but it's good to know about this createStore's ability.
export default function (data) {
  var reducer = combineReducers(reducers);
  // var finalCreateStore = applyMiddleware(promiseMiddleware)(createStore);
  // var store = finalCreateStore(reducer, data);
  /**
   * Use this extension for redux devtools 
   * https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en
   */
  var store = createStore(
    reducer,
    data,
    composeEnhancers(applyMiddleware(promiseMiddleware)),
  );
  return store;
}