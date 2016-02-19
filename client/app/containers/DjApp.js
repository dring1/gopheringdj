import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MainSection from '../components/Main';
import Actions from '../actions';

class DjApp extends Component {
  static propTypes = {
    songs: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.actions.connect();
  }

  render() {
    const { songs, actions } = this.props;
    return (
      <div>
        <MainSection songs={songs} actions={actions} />
      </div>
    );
  }
}

function mapState(state) {
  return {
    songs: state.songs,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}

export default connect(mapState, mapDispatch)(DjApp);
