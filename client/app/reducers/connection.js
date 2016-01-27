import * as ActionTypes from '../constants/ConnTypes';

const initialState = {
  loading: false,
  connected: false,
  errorMessage: null,
};

export default function songs(state = initialState, action) {
  console.log('IAM :', action);
  switch (action.type) {
  case ActionTypes.CONNECTING:
    return {
      loading: true,
      connected: false,
      errorMessage: null,
    };
  case ActionTypes.CONNECTED:

    return {
      loading: false,
      connected: true,
      errorMessage: null,
    };
  default:
    return state;
  }
}
