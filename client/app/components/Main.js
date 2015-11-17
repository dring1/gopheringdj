import React from 'react';
import mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { RouteHandler } from 'react-router';
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

class Main extends React . Component {
  // Move this to playing route
  static childContextTypes = {
    url: React.PropTypes.string.isRequired,
    websocket: React.PropTypes.string.isRequired,
    muiTheme: React.PropTypes.object,
  }

  getChildContext() {
    return {
      url: '192.168.99.100:9015',
      websocket: 'websocket',
      muiTheme: newTheme,
    };
  }

  render() {
    return (
    <div>
      <RouteHandler {...this.props} />
    </div>
    );
  }
}

export default Main;
