import React from 'react';
import mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { RouteHandler } from 'react-router';
var ThemeManager = mui.Styles.ThemeManager;
var Theme = ThemeManager.getMuiTheme(mui.Styles.LightRawTheme);
var appPalette = {
primary1Color: "#e67e22",
primary2Color: "#e67e22",
primary3Color: "#A9D2EB",
accent1Color: "#ED3B3B",
accent2Color: "#ED2B2B",
accent3Color: "#F58C8C",
canvasColor: mui.Styles.Colors.redA100,

  // rest of the palette is set from Theme Manager
};
var newTheme = ThemeManager.modifyRawThemePalette(Theme,appPalette);
let AppBar = mui.AppBar;
let IconButton = mui.IconButton;
let DatePicker = mui.DatePicker;

injectTapEventPlugin();

class Main extends React . Component {
  render() {
    return (
    <div>
      <AppBar title="GopheringDj"> <DatePicker className="center" defaultDate={new Date()}/> </AppBar>
      <RouteHandler {...this.props} />
    </div>
    )
  }
  // Move this to playing route
  getChildContext() {
    return {
      url: 'localhost:9015',
      websocket: 'websocket',
      muiTheme: Theme,
    };
  }
  static childContextTypes = {
    url: React.PropTypes.string.isRequired,
    websocket: React.PropTypes.string.isRequired,
    muiTheme: React.PropTypes.object,
  }
}

export default Main;
