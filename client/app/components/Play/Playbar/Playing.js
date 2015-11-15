import React from 'react';
import YouTube from 'react-youtube';

class Playing extends React . Component {
  constructor( props ) {
    super( props );
    this.state = {
      key: '',
      metadata: {},
    };
  }

  static propTypes = {
    metadata: React.PropTypes.object.isRequired,
  }

  static contextTypes = {
    callback: React.PropTypes.func,
    onError: React.PropTypes.func,
    onEnd: React.PropTypes.func,
    onPlay: React.PropTypes.func,
  }

  render() {
    const data = this.props.metadata;
    const opts = {
      height: '54',
      width: '150',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        // controls: 0,
      },
    };
    if (data === undefined) {
      return (
        <div></div>
      );
    }

    return (
    <YouTube url={ data.url }
      opts={opts}
      onPlay={this.context.onPlay}
      onError={this.context.onError}
      onEnd={this.context.onEnd} />
    );
  }

}

export default Playing;
