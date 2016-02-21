import React from 'react';
import mui from 'material-ui';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { jumpSong } from '../../actions/DjActions';

const MusicNoteIcon = require('material-ui/lib/svg-icons/image/music-note');
const List = mui.List;
const ListItem = mui.ListItem;
const ListDivider = mui.Divider;

const Playlist = props => {
  const songs = props.songs.songs.map((song, index) => {
    return <ListItem primaryText={song.title} key={index} onClick={() => props.actions.jumpSong(index)} />;
  });
  return (
    <div>{songs}</div>
  );
};

Playlist.propTypes = {
  songs: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ jumpSong }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
