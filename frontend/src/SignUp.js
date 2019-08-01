import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCard, MDBCardBody } from 'mdbreact';
import axios from 'axios';
import { login } from './utils';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: ""
    };
    this.signupHandleClick = this.signupHandleClick.bind(this);
    this.signinHandleClick = this.signinHandleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  signupHandleClick() {
    const params = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };
    axios.post('http://localhost:3003/api/signup', params)
      .then(
        response => {
          //console.log('response: ' + response);
          login(response.data);
          this.props.userLoggedIn();
        }
      )
      .catch(
        error => {
          // show label with red text
          console.log('error: ' + error);
        }
      );
  }
  signinHandleClick() {
    this.props.signInClick();
  }

  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
    <MDBContainer className="min-vh-100">
      <MDBRow className="d-flex justify-content-center min-vh-100 align-items-center">
        <MDBCol md="6">
          <MDBCard>
            <div className="header pt-3 grey lighten-2">
              <MDBRow className="d-flex justify-content-start">
                <h3 className="deep-grey-text mt-3 mb-4 pb-1 mx-5">
                  Sign up
                </h3>
              </MDBRow>
            </div>
            <MDBCardBody className="mx-4 mt-4">
              <MDBInput
                name="name"
                label="Your name"
                group
                type="text"
                validate
                containerClass="mb-0"
                onInput={this.handleInput}/>
              <MDBInput
                name="email"
                label="Your email"
                group type="text"
                validate
                onInput={this.handleInput}/>
              <MDBInput
                name="password"
                label="Your password"
                group
                type="password"
                validate
                containerClass="mb-0"
                onInput={this.handleInput}
              />
              <div className="text-center mb-4 mt-5">
                <MDBBtn
                  color="danger"
                  type="button"
                  className="btn-block z-depth-2"
                  onClick={this.signupHandleClick}
                >
                  Sign up
                </MDBBtn>
              </div>
              <p className="font-small grey-text d-flex justify-content-center">
                Have an account?
                <a
                   onClick={this.signinHandleClick}
                  className="dark-grey-text font-weight-bold ml-1"
                >
                  Log in
                </a>
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    );
  }
}

export default SignUp;
