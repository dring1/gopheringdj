import React from 'react';
import mui from 'material-ui';
import Playing from './Playing';
import injectTapEventPlugin from 'react-tap-event-plugin';
const ThemeManager = new mui.Styles.ThemeManager();

let Toolbar = mui.Toolbar,
  ToolbarGroup = mui.ToolbarGroup,
  DropDownMenu = mui.DropDownMenu,
  ToolbarTitle = mui.ToolbarTitle,
  ToolbarSeparator = mui.ToolbarSeparator,
  RaisedButton = mui.RaisedButton,
  FontIcon = mui.FontIcon,
  DropDownIcon = mui.DropDownIcon,
  FloatingActionButton = mui.FloatingActionButton,
  ToggleStar = mui.ToggleStar,
  IconButton = mui.IconButton;

class Playbar extends React . Component {
  constructor( props ) {
    super( props );
    this.state = {
      metadata: {}
    }
  }
  render() {
    return (
    <footer>
        <Toolbar className="parent">
          <ToolbarGroup key={0} float="left">
            <Playing metadata={this.state.metadata}/>
          </ToolbarGroup>
          <ToolbarGroup className="child" key={1}>
            <IconButton iconClassName="fa fa-chevron-left"/>
            <IconButton iconClassName="fa fa-youtube-play"/>
            <IconButton iconClassName="fa fa-chevron-right"/>
          </ToolbarGroup>
        </Toolbar>
      </footer>
    )
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }
  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    metadata: React.PropTypes.object.isRequired
  }
}

export default Playbar;
