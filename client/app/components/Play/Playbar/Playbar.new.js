import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import mui from 'material-ui';
import Playing from './Playing.new';
import ControlButton from './ControlButton';
import Actions from '../../../actions';

const Toolbar = mui.Toolbar;
const ToolbarGroup = mui.ToolbarGroup;


const Playbar = props => {
  console.log(props);
    const buttonStyle = {
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)',
    };

    // const centerStyle = {
    //   display: 'flex',
    //   'justify-content': 'center',
    //   'align-items': 'center',
    // };
    const footerStyle = {
      position: 'fixed',
      left: 0,
      bottom: 0,
    };
    return (
      <div className={footerStyle}>
        <Toolbar className="parent" float="left">
          <ToolbarGroup style={buttonStyle} key={0}>
            <ControlButton icon="fa fa-chevron-left" action={props.actions.prevSong}/>
          </ToolbarGroup>
          <ToolbarGroup  className="child" key={1}>
            <Playing className="center"{...props}/>
          </ToolbarGroup>
          <ToolbarGroup style={buttonStyle} key={2} float="right">
            <ControlButton icon="fa fa-chevron-right" action={props.actions.nextSong}/>
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
  if (state.songs.songs.length === 0) {
    return { song: {} };
  }
  return { song: state.songs.songs[state.songs.index] };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Playbar);
