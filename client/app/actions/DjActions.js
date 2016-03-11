import * as types from '../constants';

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
    type: types.DjTypes.NEXT_SONG,
  };
}

export function prevSong() {
  // console.log(song);
  return {
    type: types.DjTypes.PREV_SONG,
  };
}

export function jumpSong(index) {
  return {
    type: types.DjTypes.JUMP_SONG,
    index,
  };
}

export function onError() {
  return {
    type: types.DjTypes.NEXT_SONG,
  };
}

export function onPlay() {
  return {
    type: types.DjTypes.PAUSED_SONG,
  };
}

export function onEnd() {
  return {
    type: types.DjTypes.NEXT_SONG,
  };
}
