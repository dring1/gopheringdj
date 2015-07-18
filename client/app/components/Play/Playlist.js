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
      date: {}
    };
  }
  render() {
    var playlist = this.props.playlist.map( (song, i) => {

      var component;


      if ( i === 0 ) {
        component = <Playing/>;
      } else {
        component = <ListItem primaryText={song.title} />;
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

  getChildContext() {
    return { muiTheme: ThemeManager.getCurrentTheme() };
  }
  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }
  static propTypes = {
    playlist: React.PropTypes.array.isRequired,
  }
}

export default Playlist;
