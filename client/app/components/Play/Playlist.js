import React from 'react';
import mui from 'material-ui';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import Playbar from './Playbar/Playbar';

const MusicNoteIcon = require('material-ui/lib/svg-icons/image/music-note');
const List = mui.List;
const ListItem = mui.ListItem;
const ListDivider = mui.ListDivider;

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

  static propTypes = {
    list: React.PropTypes.array.isRequired,
  }

  static childContextTypes = {
    callback: React.PropTypes.func,
    onError: React.PropTypes.func,
    onEnd: React.PropTypes.func,
    onPlay: React.PropTypes.func,
    mutex: React.PropTypes.bool,
  }

  getChildContext() {
    return {
      callback: this.onChangeSong.bind(this),
      onError: this.onError.bind(this),
      onEnd: this.onEnd.bind(this),
      onPlay: this.onPlay.bind(this),
      mutex: this.state.mutex,
    };
  }

  onChangeSong( index ) {
    let i = index;
    if (this.state.mutex) {
      // console.log('Waiting on youtube');
      return;
    }
    // console.log('new index', index, 'length', this.state.listLength);
    if (index < 0) {
      i = this.props.list.length - 1;
    }

    if ( index > this.props.list.length - 1) {
      i = 0;
    }

    this.setState( {
      mutex: true,
      playing: i,
    } );
  }

  onError() {
    // If error play the next song
    // if the error occurs on the last song,
    // return to the first song
    let index = this.state.playing;
    if (index === (this.state.listLength - 1 )) {
      index = -1;
    }
    this.setState({mutex: false});
    this.onChangeSong(++index);
  }

  onEnd() {
    // console.log('song ended', this);
    this.onError();
  }

  onPlay() {
    // console.log('Mutex off');
    this.setState({mutex: false});
    return;
    // if (!("Notification" in window)) {
    //   alert("This browser does not support desktop notification");
    // }

    // // Let's check whether notification permissions have already been granted
    // else if (Notification.permission === "granted") {
    //   console.log(this.state)
    //   // If it's okay let's create a notification
    //   // var options = {
    //   //   body: theBody,
    //   //   icon: theIcon
    //   // }
    //   var notification = new Notification(this.state.current);
    // }

    // // Otherwise, we need to ask the user for permission
    // else if (Notification.permission !== 'denied') {
    //   Notification.requestPermission(function (permission) {
    //     // If the user accepts, let's create a notification
    //     if (permission === 'granted') {
    //       var notification = new Notification('Hi there!');
    //     }
    //   });
    // }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }

  render() {
    const playlist = this.props.list.map( (song, index) => {
      let
        component = (
          <div>
            <ListItem primaryText={song.title} key={index} onClick={ this.onChangeSong.bind( this, index ) } />
            <ListDivider />
          </div>
        );
      if ( index === this.state.playing ) {
        component = (
          <div>
            <ListItem leftIcon={<MusicNoteIcon/>} primaryText={song.title} key={index} onClick={ this.onChangeSong.bind( this, index ) } />
            <ListDivider inset={true} />
          </div>
        );
      }
      return (component);
    });

    // console.log('current playing', this.state);
    if ( this.props.list.length === 0 ) {
      return (
        <div></div>
      );
    }
    return (
    <div>
      <div className="page-wrap">
      < List>
        {playlist}
        < /List>
        < ListDivider />
        </div>
        <div className="footer">
          <Playbar metadata={this.props.list[this.state.playing] } index={this.state.playing} parentCallback={this.onChangeSong.bind(this)} />
        </div>
    </div>
    );
  }

}

export default Playlist;
