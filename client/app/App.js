require('../assets/styles/styles.css');
import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
// import routes from './config/routes';

import Main from './components/Main';

// Router.run(routes, (Root, state) => {
//   render(<Root {...state} />, document.getElementById('app'));
// });

render((
  <Router>
    <Route name="app" path="/" component={Main} />
  </Router>
), document.getElementById('app'));
