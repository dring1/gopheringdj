import React from 'react';
import mui from 'material-ui';
import Playbar from './Playbar/Playbar';

const MusicNoteIcon = require('material-ui/lib/svg-icons/image/music-note');
const List = mui.List;
const ListItem = mui.ListItem;
const ListDivider = mui.Divider;

const Playlist = props => {
  const songs = props.songs.songs.map((song, index) => {
    return <ListItem primaryText={song.title} key={index} />;
  });
  return (
    <div>{songs}</div>
  );
};

Playlist.propTypes = {
  songs: React.PropTypes.object.isRequired,
};

export default Playlist;
