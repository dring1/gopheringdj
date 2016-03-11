import React from 'react';
import mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Play from './Dj';
import Playbar from './Play/Playbar/Playbar.new';
import Actions from '../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
require('../../assets/styles/styles.css');
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
    actions: bindActionCreators(Actions, dispatch),
  };
}

const Main = (props) => {
    console.log(props);
    const {songs, actions} = props;
    const playbarHover = {
      position: 'fixed',
      bottom: 0,
      width: '100%',
    };
    const listStyle = {
      marginBottom: '5em',
    };
    return (
      <div>
        <div style={listStyle}>
          <Play songs={songs} {...actions}/>
        </div>
        <div style={playbarHover}>
          <Playbar />
        </div>
      </div>
    );
};

Main.propTypes = {
  songs: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
};

Main.childContextTypes = {
  muiTheme: React.PropTypes.object,
};

Main.getChildContext = () => { return {muiTheme: newTheme }; };

export default connect(mapStateToProps, mapDispatchToProps)(Main);
