import React from 'react';
import Main from '../components/Main';
import Home from '../components/Home';
import Dj from '../components/Dj';
import { Route, DefaultRoute } from 'react-router';


export default (
  <Route name="app" path="/" handler={Main}>
    <DefaultRoute handler={Dj} />
  </Route>
);
