import React from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { withRouter } from 'react-router-dom';

class AppLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAccount: true
    };
    this.signUpClick = this.signUpClick.bind(this);
    this.signInClick = this.signInClick.bind(this);
    this.userLoggedIn = this.userLoggedIn.bind(this);
  }

  signUpClick() {
    this.setState({ hasAccount: false });
  }

  signInClick() {
    this.setState({ hasAccount: true });
  }

  userLoggedIn() {
    this.props.history.push('/menu');
  }

  render() {
    let currentView;
    if (this.state.hasAccount) {
      currentView = <SignIn signUpClick={this.signUpClick} userLoggedIn={this.userLoggedIn} />;
    } else {
      currentView = <SignUp signInClick={this.signInClick} userLoggedIn={this.userLoggedIn} />;
    }
    return(
      <div className="min-vh-100">
        {currentView}
      </div>
    );
  }
}

export default withRouter(AppLogin);
