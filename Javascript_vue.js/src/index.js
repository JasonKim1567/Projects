import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.scss';
import Main from './pages/Main/Main';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path='/' exact component={Main} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
