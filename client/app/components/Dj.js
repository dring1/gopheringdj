import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Playlist from './Play/Playlist';
// import DjFetcher from '../util/GoFetchDj';
injectTapEventPlugin();

class Play extends React . Component {
  // constructor( props ) {
  //   super( props );
  //   // this.state = {
  //   //   list: [],
  //   // };
  // }

  static contextTypes = {
    url: React.PropTypes.string.isRequired,
    websocket: React.PropTypes.string.isRequired,
  }

  static propTypes = {
    addSong: React.PropTypes.func.isRequired,
    connect: React.PropTypes.func.isRequired,
  }
  componentDidMount() {
    this.props.connect();
  }

  handleSubmit() {
    this.props.addSong('PEW');
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <button onClick={::this.handleSubmit}> Add song </button>
        {this.props.songs.songs.map((i, v) => {
            return <div key={v}> {i.title} {v} </div>;
          })
        }
      </div>
    );
  }

  init() {
    return;
    // const that = this;
    // // const date = this.router.getCurrentParams().date === undefined ?
    // //   'current' : this.router.getCurrentParams().date;
    // this.dj = new DjFetcher( this.context.url, this.context.websocket, {
    //   new_song: (song) => {
    //     that.setState( {
    //       list: that.state.list.concat( [
    //         song,
    //       ] ),
    //     } );
    //   },
    // } );
    // this.dj.connect().getCurrent()
    //   .then( (dataObj) => {
    //     // console.log( dataObj )
    //     this.setState( {
    //       list: dataObj.data,
    //     } );
    //   } )
    //   .then( () => {
    //     // console.log( 'activating handlers' )
    //     this.dj.addHandlers();
    //   } )
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }
}

export default Play;
