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
      height: '54',
      width: '150',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        // controls: 0,
      }
    };
    if (data === undefined) {
      return (
        <div></div>
      )
    };

    return (
    <YouTube url={ data.url }
      opts={opts}
      onPlay={this._onPlay}
      onError={this._onError}
      onEnd={this._onEnd} />
    );
  }

  _onPlay( event ) {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  }

  _onError( event ) {
    this.context.onError()
  }

  _onEnd ( event ) {
    this.context.onEnd()
  }

  static contextTypes = {
    error: React.PropTypes.function,
    end: React.PropTypes.function,
  }

  static propTypes = {
    // key: React.PropTypes.number.isRequired,
    metadata: React.PropTypes.object.isRequired
  }
}

export default Playing;
