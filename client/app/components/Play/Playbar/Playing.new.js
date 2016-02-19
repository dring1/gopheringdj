import React from 'react';
import YouTube from 'react-youtube';
import { youtubeId } from '../../../util/youtube';

const Playing = props => {
  console.log('playing props', props);
  const options = {
    height: '54',
    width: '170',
    playerVars: {
      autoplay: 1,
    },
  };
  if (Object.keys(props.song).length === 0 ) {
    return (
      <div></div>
    );
  }
    const x = youtubeId(props.song.url)
  return (
    <YouTube
      videoId={x}
      opts={options}
      onPlay={props.actions.onPlay}
      onError={props.actions.onError}
      onEnd={props.actions.onEnd}
    />
  );
};

Playing.propTypes = {
  song: React.PropTypes.object.isRequired,
  actions: React.PropTypes.shape({
    onPlay: React.PropTypes.func.isRequired,
    onError: React.PropTypes.func.isRequired,
    onEnd: React.PropTypes.func.isRequired,
  }),
};

export default Playing;
