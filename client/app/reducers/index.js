import { combineReducers } from 'redux';
import songs from './songs';
import connection from './connection';

function lastAction(state = null, action) {
  return action;
}

const rootReducer = combineReducers({
  songs,
  connection,
  lastAction,
});

export default rootReducer;
