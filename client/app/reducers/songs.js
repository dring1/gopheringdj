import * as ActionTypes from '../constants/DjTypes';

const initialState = {
  songs: [],
  index: 0,
};

export default function songs(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.ADD_SONG:
    return {
      songs: [
        ...state.songs,
        action.song,
      ],
      index: state.index,
    };
  case ActionTypes.NEXT_SONG:
    // let i = state.index;
    // if (i > len(state.songs)) {
    //
    // }
    // return {
    //   songs: state.songs,
    //   index: state.index + 1,
    // };
    return {
      ...state,
      index: state.index + 1,
    };
  case ActionTypes.PREV_SONG:
    return state;
  case ActionTypes.JUMP_SONG:
    return state;
  case ActionTypes.ADD_LIBRARY:
    return {
      songs: action.songs,
      index: 0,
    };
  default:
    return state;
  }
}
