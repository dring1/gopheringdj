import React from 'react';
import {render} from 'react-dom';
import configureStore from './store/configureStore';
import Root from './containers/Root';
import * as ActionTypes from './constants';
import DjFetcher from './util/GoFetchDj';
import {receiveEvent} from './actions';


const store = configureStore();

const sock = {
  ws: null,
  URL: 'localhost:3000',
  ROUTE: 'websocket',
  wsDispatcher: (msg) => {
    // const { session } = redux.getState();
    return store.dispatch(receiveEvent(msg));
  },
  wsListener: () => {
    const {lastAction} = store.getState();
    switch (lastAction.type) {
      case ActionTypes.ConnTypes.CONNECTING:
          // store.dispatch();
        return;
      case ActionTypes.ConnTypes.CONNECTED:
        console.log('RECEIVED CONNTECT');
        sock.startWS();
        return;
      default:
        return;
    }
  },
  startWS: () => {
    if (sock.ws) {
      return;
    }
    sock.ws = new DjFetcher(sock.URL, sock.ROUTE, sock.wsDispatcher);
    console.log(sock);
  },
};

store.subscribe(() => sock.wsListener());

render(< Root store = {
  store
} />, document.getElementById('root'));
