import React from 'react';
import mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Playbar from './Playbar/Playbar';
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
      playing: 0,
      current: {}
    };
  }
  render() {
    var playlist = this.props.list.map( (song, index) => {
      var component;
      if ( index === this.state.playing ) {
        // component = <Playing key={index} metadata={m}/>;
        this.setState('current')
      } else {
        component = <ListItem primaryText={song.title} key={index} onClick={ this.handleSongClick.bind( this, index )} />;
      }
      return (component)
    } );
    return (
    <div>
      <div className="page-wrap">
      < List>
        {playlist}
        < /List>
        < ListDivider />
        </div>
        <div className="footer">
          <Playbar
            metadata={this.props.list[this.state.playing]}
            parentCallback={this.onClickChange}
          />
        </div>
    </div>
    )
  }

  handleSongClick( index ) {
    this.setState( {
      playing: index
    } );
  }

  childOnClickChange



  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }
  static propTypes = {
    list: React.PropTypes.array.isRequired,
  }
}

export default Playlist;
