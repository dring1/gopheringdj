import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import mui from 'material-ui';
import Playing from './Playing';
import ControlButton from './ControlButton';
import * as DjActions from '../../../actions/DjActions';

const Toolbar = mui.Toolbar;
const ToolbarGroup = mui.ToolbarGroup;


const Playbar = props => {
  console.log(props);
    const buttonStyle = {
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)',
    };

    const footerStyle = {
      position: 'fixed',
      left: 0,
      bottom: 0,
    };
    return (
      <div className={footerStyle}>
        <Toolbar className="parent" float="left">
          <ToolbarGroup style={buttonStyle} key={0}>
            <ControlButton icon="fa fa-chevron-left" action={props.actions.nextSong}/>
          </ToolbarGroup>
          <ToolbarGroup className="child" key={1}/>
          <ToolbarGroup style={buttonStyle} key={2} float="right">
            <ControlButton icon="fa fa-chevron-right" action={props.actions.prevSong}/>
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
};

Playbar.propTypes = {
  song: React.PropTypes.object.isRequired,
  actions: React.PropTypes.shape({
    nextSong: React.PropTypes.func.isRequired,
    prevSong: React.PropTypes.func.isRequired,
  }),
};

function mapStateToProps(state) {
  console.log('this is the state', state);
  return { song: {title: 'temp'} };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(DjActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Playbar);
