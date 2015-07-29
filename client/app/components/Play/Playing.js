import React from 'react';
import YouTube from 'react-youtube';

class Playing extends React . Component {

  render() {
    // var data = this.props.
    // console.log('data', data);
    console.log(this.props)
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    return (
    <YouTube url={ 'http://www.youtube.com/watch?v=2g811Eo7K8U'}
             opts={opts}
             onPlay={this._onPlay} />
    );
  }

  _onPlay( event ) {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  }
}

export default Playing;
