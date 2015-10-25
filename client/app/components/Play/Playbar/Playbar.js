import React from 'react';
import mui from 'material-ui';
import Playing from './Playing';
import injectTapEventPlugin from 'react-tap-event-plugin';

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
      metadata: {},
      paused: false
    };
  }
  render() {
    console.log('props', this.props)
    return (
    <footer>
        <Toolbar className="parent" float="left">
          <ToolbarGroup key={0}>
            <IconButton iconClassName="fa fa-chevron-left" onClick={this.previous.bind(this)}/>
          </ToolbarGroup>
          <ToolbarGroup className="child" key={1}>
            <Playing className="center" metadata={this.props.metadata}/>
          </ToolbarGroup>
          <ToolbarGroup key={2} float="right">
            <IconButton iconClassName="fa fa-chevron-right" onClick={this.forward.bind(this)}/>
          </ToolbarGroup>
        </Toolbar>
      </footer>
    )
  }

  static propTypes = {
    metadata: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    parentCallback: React.PropTypes.function
  }

  pause(){
    this.setState({paused: !this.state.paused});
  }

  forward(){
    this.props.parentCallback(++this.props.index);
  }

  previous(){
    this.props.parentCallback(--this.props.index);
  }
}

export default Playbar;
