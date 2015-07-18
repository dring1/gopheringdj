import React from 'react';
import mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Playlist from './Play/Playlist';
import DjFetcher from '../util/GoFetchDj';
const ThemeManager = new mui.Styles.ThemeManager();

injectTapEventPlugin();

class Play extends React.Component {
  constructor(props){
    console.log(props)
    super(props);
    this.state = {
      dj: new DjFetcher( 'localhost:9015', 'websocket' ),
    };
  }
  render() {
    return (
      <div></div>
    )
  }
  // Move this to playing route
  init() {
    let date =  this.router.getCurrentParams().date === undefined ?
      'current' : this.router.getCurrentParams().date;
    this.state.dj.connect().addHandlers();
    // this.Dj.getCurrent()
    //   .then((dataObj) => {
    //     console.log(dataObj);
    //     this.setState({playlist: dataObj.data});
    //   })
  }
  componentWillMount(){
    this.router = this.context.router;
  }
  componentDidMount() {
    this.init();
  }
  componentWillUnmount(){
    console.log(this)
    this.state.dj.close();
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  }

}

export default Play;
