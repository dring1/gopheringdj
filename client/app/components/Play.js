import React from 'react';
import mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Playlist from './Play/Playlist';
import DjFetcher from '../util/GoFetchDj';
const ThemeManager = new mui.Styles.ThemeManager();

injectTapEventPlugin();

class Play extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      list: []
    };
  }
  render() {
    return (
      <Playlist list={this.state.list}/>
    )
  }
  // Move this to playing route
  init() {
    let date =  this.router.getCurrentParams().date === undefined ?
      'current' : this.router.getCurrentParams().date;
    var that = this
    this.dj = new DjFetcher( this.context.url, this.context.websocket, 
    {
      new_song: function (song) {
        console.log('CAlled', song, that)
        that.setState({list: that.state.list.concat([song])});
      }
    })
    this.dj.connect().getCurrent()
      .then((dataObj) => {
        console.log(dataObj)
        this.setState({list: dataObj.data});
      })
      .then(() => {
        console.log('activating handlers')
        this.dj.addHandlers();
      })
  }
  componentWillMount(){
    this.router = this.context.router;
  }
  componentDidMount() {
    this.init();
  }
  componentWillUnmount(){
    console.log(this)
    this.dj.close();
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
    url: React.PropTypes.string.isRequired,
    websocket: React.PropTypes.string.isRequired,
  }
}

export default Play;
