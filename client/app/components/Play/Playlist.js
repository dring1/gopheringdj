import React from 'react';
import mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Playing from './Playing';
const ThemeManager = new mui.Styles.ThemeManager();

let List = mui.List,
  ListItem = mui.ListItem,
  ListDivider = mui.ListDivider;

class Playlist extends React . Component {
  constructor( props ) {
    super( props );
    this.state = {
      date: {},
      // list: [],
      playing: 0
    };
  }
  render() {
    var playlist = this.props.list.map( (song, index) => {
      var component;
      if ( index === this.state.playing) {
        // console.log(this.props.list[index])
        component = <Playing key={index} metadata={this.props.list[index]}/>;
      } else {
        // console.log(song)
        component = <ListItem primaryText={song.title} key={index} onClick={this.handleSongClick.bind(this, index)} />;
      }
      return (component)
    } );
    return (
    <div>
      < List>
        {playlist}
        < /List>
        < ListDivider />
    </div>
    )
  }

  handleSongClick(index){
    this.setState({playing: index});
  }

  getChildContext() {
    return { muiTheme: ThemeManager.getCurrentTheme() };
  }
  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }
  static propTypes = {
    list: React.PropTypes.array.isRequired,
  }
}

export default Playlist;
