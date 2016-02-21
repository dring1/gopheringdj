import * as ActionTypes from '../constants/DjTypes';

const initialState = {
  songs: [],
  index: 0,
};

export default function songs(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.NEW_SONG:
    return {
      songs: [
        ...state.songs,
        action.song,
      ],
      index: state.index,
    };
  case ActionTypes.NEXT_SONG:
    return {
      ...state,
      index: (state.index + 1 > state.songs.length) ? 0 : state.index + 1,
    };
  case ActionTypes.PREV_SONG:
    return {
      ...state,
      index: (state.index - 1 < 0) ? state.songs.length - 1 : state.index - 1,
    };
  case ActionTypes.JUMP_SONG:
    return {
      ...state,
      index: action.index,
    };
  case ActionTypes.ADD_LIBRARY:
    return {
      songs: action.songs,
      index: 0,
    };
  default:
    return state;
  }
}
