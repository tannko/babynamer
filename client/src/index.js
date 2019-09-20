import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import 'bootstrap/dist/css/bootstrap.css';
import NewList from './components/NewList';
import AppLogin from './components/AppLogin';
import Menu from './components/Menu';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import MyLists from './components/MyLists';
import SharedWithMe from './components/SharedWithMe';
import * as serviceWorker from './serviceWorker';


const routing = (
  <Router>
    <div>
      <PublicRoute restricted={true} exact path="/" component={AppLogin} />
      <PrivateRoute path="/menu" component={Menu} />
      <PrivateRoute path="/newlist" component={NewList} />
      <PrivateRoute path="/lists" component={MyLists} />
      <PrivateRoute path="/shared" component={SharedWithMe} />
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
