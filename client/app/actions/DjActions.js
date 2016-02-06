import * as types from '../constants';
import axios from 'axios';

export function connectSuccess(songs) {
  return {
    type: types.DjTypes.ADD_LIBRARY,
    songs,
  };
}

export function connectError(errorMessage) {
  return {
    type: types.ERROR,
    errorMessage,
  };
}

export function addSong() {
  // console.log(song);
  return {
    type: types.DjTypes.ADD_SONG,
    song: {title: 'Poop master flex'},
  };
}

export function nextSong() {
  // console.log(song);
  return {
    type: types.DjTypes.PREV_SONG,
  };
}

export function prevSong() {
  // console.log(song);
  return {
    type: types.DjTypes.NEXT_SONG,
  };
}

export function connect() {
  return dispatch => {
    // dispatch({
    //   type: types.ConnTypes.CONNECTING,
    // });
    return axios({
        url: `http://localhost:3000/current`,
        withCredentials: false,
      })
      .then((res) => {
        dispatch(connectSuccess(res.data));
        dispatch({type: types.ConnTypes.CONNECTED});
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function receiveEvent(event) {
  console.log(event);
  switch (event.type) {
    case types.DjTypes.ADD_SONG:
      console.log('AddSong receive event');
      return {
        type: types.DjTypes.ADD_SONG,
        song,
      };
    default:
      console.log('DEFAULT');
      return {
        type: types.DjTypes.ADD_SONG,
        song: 'NEW SONG',
      };

  }
}
