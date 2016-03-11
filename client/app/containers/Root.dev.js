import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DjApp from './DjApp';
import showDevTools from './showDevTools';

export default class Root extends Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired,
  }

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div>
          <DjApp />
          {showDevTools(store)}
        </div>
      </Provider>
    );
  }
}
