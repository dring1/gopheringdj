import React from 'react';
import mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Play from './Dj';
import * as DjActions from '../actions/DjActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const ThemeManager = mui.Styles.ThemeManager;
const Theme = ThemeManager.getMuiTheme(mui.Styles.DarkRawTheme);
const appPalette = {
  primary1Color: '#FFA000',
  primary2Color: '#FFC107',
  primary3Color: '#FFECB3',
  accent1Color: '#FFA000',
  accent2Color: '#FFA000',
  accent3Color: '#FFA000',
  borderColor: '#B6B6B6',
  textColor: '#212121',
  alternateTextColor: '#727272',
  canvasColor: mui.Styles.Colors.amber,
};
const newTheme = ThemeManager.modifyRawThemePalette(Theme, appPalette);

injectTapEventPlugin();


function mapStateToProps(state) {
  return {
    songs: state.songs,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DjActions, dispatch),
  };
}

class Main extends React.Component {
  // Move this to playing route

    static propTypes = {
      songs: React.PropTypes.object.isRequired,
      actions: React.PropTypes.object.isRequired,
    }
  static childContextTypes = {
    url: React.PropTypes.string.isRequired,
    websocket: React.PropTypes.string.isRequired,
    muiTheme: React.PropTypes.object,
  }

  getChildContext() {
    return {url: 'localhost:3000', websocket: 'websocket', muiTheme: newTheme};
  }

  render() {
    const {songs, actions} = this.props;
    return (
      <div>
        <Play songs={songs} {...actions}/>
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
