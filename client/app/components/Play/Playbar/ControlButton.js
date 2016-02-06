import React from 'react';
import mui from 'material-ui';
const IconButton = mui.IconButton;

const ControlButton = props => {
  return <IconButton iconClassName={props.icon} onClick={props.action} />;
};

ControlButton.propTypes = {
  icon: React.PropTypes.string.isRequired,
  action: React.PropTypes.func.isRequired,
};

export default ControlButton;
