import React from 'react';
import mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { RouteHandler } from 'react-router';
const ThemeManager = new mui.Styles.ThemeManager();

let AppBar = mui.AppBar;
let IconButton = mui.IconButton;
let DatePicker = mui.DatePicker;

injectTapEventPlugin();

class Main extends React.Component {
  render() {
    return (
    <div>
      <AppBar title="GopheringDj"> <DatePicker className="center" defaultDate={new Date()}/> </AppBar>
      <RouteHandler {...this.props}/>
    </div>
    )
  }
  // Move this to playing route
  getChildContext() {
    return { muiTheme: ThemeManager.getCurrentTheme() };
  }
  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }
}

export default Main;
