import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Playlist from './Play/Playlist';
import DjFetcher from '../util/GoFetchDj';
injectTapEventPlugin();

class Play extends React . Component {
  constructor( props ) {
    super( props );
    this.state = {
      list: [],
    };
  }

  static contextTypes = {
    url: React.PropTypes.string.isRequired,
    websocket: React.PropTypes.string.isRequired,
  }

  // Move this to playing route
  componentWillMount() {
    this.router = this.context.router;
  }
  componentDidMount() {
    this.init();
  }
  componentWillUnmount() {
    this.dj.close();
  }

  render() {
    return (
      <Playlist list={this.state.list}/>
    );
  }

  init() {
    const that = this;
    // const date = this.router.getCurrentParams().date === undefined ?
    //   'current' : this.router.getCurrentParams().date;
    this.dj = new DjFetcher( this.context.url, this.context.websocket, {
      new_song: (song) => {
        // console.log( 'CAlled', song, that )
        that.setState( {
          list: that.state.list.concat( [
            song,
          ] ),
        } );
      },
    } );
    this.dj.connect().getCurrent()
      .then( (dataObj) => {
        // console.log( dataObj )
        this.setState( {
          list: dataObj.data,
        } );
      } )
      .then( () => {
        // console.log( 'activating handlers' )
        this.dj.addHandlers();
      } );
  }
}

export default Play;
