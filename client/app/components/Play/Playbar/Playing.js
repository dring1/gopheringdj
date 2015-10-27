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
    console.log(this);
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
      onError={this.context.onError}
      onEnd={this.context.onEnd} />
    );
  }

  _onPlay( event ) {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  }

  _onError( event ) {
    console.log('context:', this.context);
    this.context.Error();
  }

  _onEnd ( event ) {
    console.log('context:', this);
    this.context.onEnd();
  }

  static contextTypes = {
    callback: React.PropTypes.func,
    onError: React.PropTypes.func,
    onEnd: React.PropTypes.func,
  }

  static propTypes = {
    metadata: React.PropTypes.object.isRequired
  }
}

export default Playing;
