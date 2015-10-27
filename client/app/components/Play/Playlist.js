import React from 'react';
import mui from 'material-ui';
// import injectTapEventPlugin from 'react-tap-event-plugin';

import Playbar from './Playbar/Playbar';


let List = mui.List,
  ListItem = mui.ListItem,
  ListDivider = mui.ListDivider;

class Playlist extends React . Component {
  constructor( props ) {
    super( props );
    this.state = {
      date: {},
      playing: 0,
      listLength: 0,
      current: {}
    };
  }
  render() {
    var playlist = this.props.list.map( (song, index) => {
      var component;
      if ( index === this.state.playing ) {
        // highlight
      }
      component = <ListItem primaryText={song.title} key={index} onClick={ this.changeSong.bind( this, index ) } />;
      return (component)
    } );

    console.log('current playing', this.state)
    if (this.props.list.length === 0 ) {
      return  (
        <div></div>
      )
    };
    return (
    <div>
      <div className="page-wrap">
      < List>
        {playlist}
        < /List>
        < ListDivider />
        </div>
        <div className="footer">
          <Playbar metadata={this.props.list[this.state.playing] } index={this.state.playing} parentCallback={this.changeSong.bind(this)} />
        </div>
    </div>
    )
  }

  changeSong( index ) {

    console.log('new index', index, 'length', this.state.listLength);

    if (index < 0) {
      index = this.props.list.length -1;
    };

    if ( index > this.props.list.length - 1) {
      index = 0;
    };

    this.setState( {
      playing: index
    } );
  }

  onError(){
    // If error play the next song
    // if the error occurs on the last song,
    // return to the first song
    var index = this.state.playing;
    if (index === (this.state.listLength - 1 )) {
      index = -1;
    };
    this.changeSong(++index);
  }

  onEnd(){
    console.log("song ended", this);
    this.onError()
  }


  // componentWillReceiveProps(){
  //   console.log('didmountLength:', this.props.list.length)
  //   this.setState({listLength: this.props.list.length});
  // }

  getChildContext() {
    console.log('get child context called');
    return {
      callback: this.changeSong.bind(this),
      onError: this.onError.bind(this),
      onEnd: this.onEnd.bind(this),
    };
  }

  static childContextTypes = {
    callback: React.PropTypes.func,
    onError: React.PropTypes.func,
    onEnd: React.PropTypes.func,
  }

  static propTypes = {
    list: React.PropTypes.array.isRequired,
  }
}

export default Playlist;
