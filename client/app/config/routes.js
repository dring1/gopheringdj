import React from 'react';
import Main from '../components/Main';
import Home from '../components/Home';
import Play from '../components/Play';
import { Router, Route, DefaultRoute } from 'react-router';


export default (
  <Route name="app" path="/" handler={Main}>
    <Route name="play" path="play/:date" handler={Play}/>
    <Route path="*" handler={Home} />
    <DefaultRoute handler={Home} />
  </Route>
);
