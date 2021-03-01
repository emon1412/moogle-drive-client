/* eslint-disable */ /* disabled for Hot Loader */
import './styles/main.css'
import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';

//allows async await

import Root from './Root';
import reducer from '../src/reducers/Reducers';
import { setReduxStore as setFetchReduxStore } from './MoogleDriveFetch';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunk];
const store = createStore(reducer, {}, composeEnhancers(applyMiddleware(...middleware)));

// This allows us to use data in the state for our default fetch
setFetchReduxStore(store);
const rootEl = document.getElementById('app');

// This AppContainer is for Hot reloading and other potential dev tools
render(
  <Root store={store} />,
  rootEl
);
