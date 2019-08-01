import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import 'bootstrap/dist/css/bootstrap.css';
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCol} from "mdbreact";
import App from './App';
import AppLogin from './AppLogin';
import Menu from './Menu';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import MyLists from './MyLists';
import SharedWithMe from './SharedWithMe';
import * as serviceWorker from './serviceWorker';


const routing = (
  <Router>
    <div>
      <PublicRoute restricted={true} exact path="/" component={AppLogin} />
      <PrivateRoute path="/menu" component={Menu} />
      <PrivateRoute path="/newlist" component={App} />
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
