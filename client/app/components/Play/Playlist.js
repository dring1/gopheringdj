import React from 'react';
import mui from 'material-ui';
// import injectTapEventPlugin from 'react-tap-event-plugin';

import Playbar from './Playbar/Playbar';

let ContentInbox = require('material-ui/lib/svg-icons/image/music-note');


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
      component = <ListItem leftIcon={<ContentInbox/>} primaryText={song.title} key={index} onClick={ this.changeSong.bind( this, index ) } />;
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

  onPlay(){
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


  // componentWillReceiveProps(){
  //   console.log('didmountLength:', this.props.list.length)
  //   this.setState({listLength: this.props.list.length});
  // }

  getChildContext() {
    return {
      callback: this.changeSong.bind(this),
      onError: this.onError.bind(this),
      onEnd: this.onEnd.bind(this),
      onPlay: this.onPlay.bind(this),
    };
  }

  static childContextTypes = {
    callback: React.PropTypes.func,
    onError: React.PropTypes.func,
    onEnd: React.PropTypes.func,
    onPlay: React.PropTypes.func,
  }

  static propTypes = {
    list: React.PropTypes.array.isRequired,
  }
}

export default Playlist;
