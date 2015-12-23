import React from 'react';
import Main from '../components/Main';
import Dj from '../components/Dj';
import { Route, DefaultRoute } from 'react-router';


export default (
  <Route name="app" path="/" component={Main}>
    <DefaultRoute component={Dj} />
  </Route>
);
