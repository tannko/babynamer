import React from 'react';
import ShortlistBody from './ShortlistBody';
import ErrorMessage from './ErrorMessage';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle } from 'mdbreact';
import { MDBCardFooter, MDBCardText, MDBCardHeader } from 'mdbreact';
import { MDBTable, MDBInput } from 'mdbreact';

class NewListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "" };
    this.nameInput = React.createRef();
    this.updateRating = this.updateRating.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.focusNameInput = this.focusNameInput.bind(this);
  }

  componentDidMount() {
    this.focusNameInput();
  }

  handleInput(e) {
    this.props.updateListname(e.target.value);
  }

  updateRating(list) {
    this.props.updateRating(list);
  }

  submitHandler = event => {
    event.preventDefault();
    event.target.className += " was-validated";
    const regex = /\w+/;
    if (this.props.name.trim() !== "" && regex.test(this.props.name.trim())) {
      this.props.saveNewList();
    }
  }

  focusNameInput() {
    this.nameInput.focus();
  }

  render() {
    const title = this.props.name;
    const size = this.props.list.size;
    const count = size > 1 ? size + " names" : size + " name";
    const isError = this.state.error === "" ? false : true;
    return (
        <form
          className="needs-validation"
          onSubmit={this.submitHandler}
          noValidate
          >
            <MDBCard>
              <MDBCardBody>
                { isError && <ErrorMessage message={this.state.error} />}
                <MDBCardTitle className="text-center">
                  <MDBInput inputRef={ref => this.nameInput = ref} label="Your list name" size="lg" name="title" onInput={this.handleInput} required pattern="\w+">
                    <div className="invalid-feedback">
                      Please add valid list name. List name can contain letters, numbers and underscore.
                    </div>
                  </MDBInput>
                </MDBCardTitle>
                <MDBCardText className="text-center">Now you can rate chosen names clicking on stars</MDBCardText>
                <ShortlistBody list={this.props.list} updateRating={this.updateRating} />
                <div className="d-flex justify-content-end">
                  <MDBBtn color="secondary" onClick={this.props.backToMenu}>Cancel</MDBBtn>
                  <MDBBtn color="primary" type="submit">Save</MDBBtn>
                </div>
              </MDBCardBody>
              <MDBCardFooter>
                <div className="text-center">{count}</div>
              </MDBCardFooter>
            </MDBCard>

        </form>

    );
  }
}
export default NewListComponent;
