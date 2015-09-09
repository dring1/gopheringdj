import React from 'react';
import YouTube from 'react-youtube';

class Playing extends React . Component {
  constructor( props ) {
    super( props );
    this.state = {
      key: "",
      metadata: {}
    };
  }
  render() {
    var data = this.props.metadata;
    const opts = {
      height: '39',
      width: '64',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    return (
    <YouTube url={ data.url }
    opts={opts}
    onPlay={this._onPlay} />
    );
  }

  _onPlay( event ) {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  }

  static propTypes = {
    key: React.PropTypes.number.isRequired,
    metadata: React.PropTypes.object.isRequired
  }
}

export default Playing;
