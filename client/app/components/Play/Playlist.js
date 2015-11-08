import React from 'react';
import mui from 'material-ui';
// import injectTapEventPlugin from 'react-tap-event-plugin';

import Playbar from './Playbar/Playbar';

let MusicNoteIcon = require('material-ui/lib/svg-icons/image/music-note');


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
      current: {},
      mutex: true,
    };
  }
  render() {

    var playlist = this.props.list.map( (song, index) => {
      var
        component = <ListItem primaryText={song.title} key={index} onClick={ this.changeSong.bind( this, index ) } />;
      if ( index === this.state.playing ) {
        component = <ListItem leftIcon={<MusicNoteIcon/>} primaryText={song.title} key={index} onClick={ this.changeSong.bind( this, index ) } />;
      }
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
    if (this.state.mutex) {
      console.log("Waiting on youtube");
      return;
    };
    console.log('new index', index, 'length', this.state.listLength);
    if (index < 0) {
      index = this.props.list.length -1;
    };

    if ( index > this.props.list.length - 1) {
      index = 0;
    };

    this.setState( {
      mutex: true,
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
    this.setState({mutex: false});
    this.changeSong(++index);
  }

  onEnd(){
    console.log("song ended", this);
    this.onError()
  }

  onPlay(){
    console.log("Mutex off");
    this.setState({mutex: false});
    return;
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      console.log(this.state)
      // If it's okay let's create a notification
      // var options = {
      //   body: theBody,
      //   icon: theIcon
      // }
      var notification = new Notification(this.state.current);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification("Hi there!");
        }
      });
    }

    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
  }

  getChildContext() {
    return {
      callback: this.changeSong.bind(this),
      onError: this.onError.bind(this),
      onEnd: this.onEnd.bind(this),
      onPlay: this.onPlay.bind(this),
      mutex: this.state.mutex,
    };
  }

  static childContextTypes = {
    callback: React.PropTypes.func,
    onError: React.PropTypes.func,
    onEnd: React.PropTypes.func,
    onPlay: React.PropTypes.func,
    mutex: React.PropTypes.bool,
  }

  static propTypes = {
    list: React.PropTypes.array.isRequired,
  }
}

export default Playlist;
