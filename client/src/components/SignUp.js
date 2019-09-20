import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCard, MDBCardBody } from 'mdbreact';
import axios from 'axios';
import { login } from '../utils/utils';
import ErrorMessage from './ErrorMessage';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      error: ""
    };
    this.signupHandleClick = this.signupHandleClick.bind(this);
    this.signinHandleClick = this.signinHandleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  submitHandler = event => {
    event.preventDefault();
    event.target.className += " was-validated";
    if (this.state.name.trim() !== ""
      && this.state.email.trim() !== ""
      && this.state.password.trim() != ""
    ) {
      this.signupHandleClick();
    }
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
          this.setState({ error: "" });
        }
      )
      .catch(
        error => {
          this.setState({ error: error.message });
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
    const isError = this.state.error === "" ? false : true;
    return (
    <MDBContainer className="min-vh-100">
      <form
        className="needs-validation"
        onSubmit={this.submitHandler}
        noValidate>
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
              { isError && <ErrorMessage message={this.state.error} />}
              <MDBInput
                name="name"
                label="Your name"
                group
                type="text"
                containerClass="mb-0"
                onInput={this.handleInput}
                required
                pattern="\w+">
              <div className="invalid-feedback">
                Please enter valid name. Valid name can contain letters, numbers and underscore.
              </div>
              </MDBInput>
              <MDBInput
                name="email"
                label="Your email"
                group type="text"
                onInput={this.handleInput}
                required
                pattern="\S+">
              <div className="invalid-feedback">
                Please enter email
              </div>
              </MDBInput>
              <MDBInput
                name="password"
                label="Your password"
                group
                type="password"
                containerClass="mb-0"
                onInput={this.handleInput}
                required
                pattern="\S+">
              <div className="invalid-feedback">
                Please enter password
              </div>
              </MDBInput>
              <div className="text-center mb-4 mt-5">
                <MDBBtn
                  color="danger"
                  className="btn-block z-depth-2"
                  type="submit"
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
      </form>
    </MDBContainer>
    );
  }
}

export default SignUp;
