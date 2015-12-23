import React from 'react';
import mui from 'material-ui';
import Playing from './Playing';
// import injectTapEventPlugin from 'react-tap-event-plugin';

const Toolbar = mui.Toolbar;
const ToolbarGroup = mui.ToolbarGroup;
const IconButton = mui.IconButton;

class Playbar extends React . Component {
  constructor( props ) {
    super( props );
    this.state = {
      metadata: {},
      paused: false,
    };
  }

  static propTypes = {
    metadata: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    parentCallback: React.PropTypes.func,
  }

  static contextTypes = {
    mutex: React.PropTypes.bool,
  }

  render() {
    const buttonStyle = {
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)',
    };
    return (
    <footer>
        <Toolbar className="parent" float="left">
          <ToolbarGroup style={buttonStyle} key={0}>
            <IconButton iconClassName="fa fa-chevron-left" onClick={this.previous.bind(this)}/>
          </ToolbarGroup>
          <ToolbarGroup className="child" key={1}>
            <Playing className="center" metadata={this.props.metadata}/>
          </ToolbarGroup>
          <ToolbarGroup style={buttonStyle} key={2} float="right">
            <IconButton iconClassName="fa fa-chevron-right" onClick={this.forward.bind(this)}/>
          </ToolbarGroup>
        </Toolbar>
      </footer>
    );
  }

  pause() {
    this.setState({paused: !this.state.paused});
  }

  forward() {
    this.props.parentCallback(this.props.index + 1);
  }

  previous() {
    this.props.parentCallback(this.props.index - 1);
  }


}

export default Playbar;
