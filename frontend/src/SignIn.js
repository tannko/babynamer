import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdbreact';
import axios from 'axios';
import { login } from './utils';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password:""
    };
    this.loginHandleClick = this.loginHandleClick.bind(this);
    this.signupHandleClick = this.signupHandleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  loginHandleClick() {
    const params = {
      email: this.state.email,
      password: this.state.password
    };
    axios.post('http://localhost:3003/api/signin', params)
      .then(
        response => {
          //console.log("response: " + response);
          login(response.data);
          this.props.userLoggedIn();
        }
      ).catch(
        error => {
          console.log("error: " + error);
        }
      );
  }

  signupHandleClick() {
    this.props.signUpClick();
  }

  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
    <MDBContainer className="min-vh-100">
      <MDBRow className="min-vh-100 align-items-center justify-content-center ">
        <MDBCol md="6">
          <MDBCard>
            <div className="header pt-3 grey lighten-2">
              <MDBRow className="d-flex justify-content-start">
                <h3 className="deep-grey-text mt-3 mb-4 pb-1 mx-5">
                  Log in
                </h3>
              </MDBRow>
            </div>
            <MDBCardBody className="mx-4 mt-4">
              <MDBInput
                label="Your email"
                name="email"
                group
                type="text"
                validate
                onInput={this.handleInput}/>
              <MDBInput
                label="Your password"
                name="password"
                group
                type="password"
                validate
                containerClass="mb-0"
                onInput={this.handleInput}
              />
              <p className="font-small grey-text d-flex justify-content-end">
                Forgot
                <a

                  className="dark-grey-text font-weight-bold ml-1"
                >
                  Password?
                </a>
              </p>
              <div className="text-center mb-4 mt-5">
                <MDBBtn
                  color="danger"
                  type="button"
                  className="btn-block z-depth-2"
                  onClick={this.loginHandleClick}
                >
                  Log in
                </MDBBtn>
              </div>
              <p className="font-small grey-text d-flex justify-content-center">
                Don't have an account?
                <a
                   onClick={this.signupHandleClick}
                  className="dark-grey-text font-weight-bold ml-1"
                >
                  Sign up
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

export default SignIn;
