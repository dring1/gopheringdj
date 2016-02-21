import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Playlist from './Play/Playlist.new';

// import DjFetcher from '../util/GoFetchDj';
injectTapEventPlugin();
//
const Play = props => {
  return (
    <div>
      <Playlist songs={props.songs} />
    </div>
  );
};

Play.propTypes = {
  songs: React.PropTypes.object.isRequired,
};

// Play.componentDidMount = props => {
//   props.connect();
// };

// class Play extends React . Component {
//
//   static propTypes = {
//     addSong: React.PropTypes.func.isRequired,
//     connect: React.PropTypes.func.isRequired,
//   }
//   // Keep this here ?
//   componentDidMount() {
//     this.props.connect();
//   }
//
//   handleSubmit() {
//     this.props.addSong('PEW');
//   }
//
//   render() {
//     return (
//       <div>
//         <button onClick={::this.handleSubmit}> Add song </button>
//         {this.props.songs.songs.map((i, v) => {
//             return <div key={v}> {i.title} {v} </div>;
//           })
//         }
//       </div>
//     );
//   }
//
//   init() {
//     return;
//     // const that = this;
//     // // const date = this.router.getCurrentParams().date === undefined ?
//     // //   'current' : this.router.getCurrentParams().date;
//     // this.dj = new DjFetcher( this.context.url, this.context.websocket, {
//     //   new_song: (song) => {
//     //     that.setState( {
//     //       list: that.state.list.concat( [
//     //         song,
//     //       ] ),
//     //     } );
//     //   },
//     // } );
//     // this.dj.connect().getCurrent()
//     //   .then( (dataObj) => {
//     //     // console.log( dataObj )
//     //     this.setState( {
//     //       list: dataObj.data,
//     //     } );
//     //   } )
//     //   .then( () => {
//     //     // console.log( 'activating handlers' )
//     //     this.dj.addHandlers();
//     //   } )
//     //   .catch((err) => {
//     //     console.log(err);
//     //   });
//   }
// }

export default Play;
