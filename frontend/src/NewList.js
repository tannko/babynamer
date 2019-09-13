import React from 'react';
import ShortlistRow from './components/ShortlistRow';
import ShortlistBody from './ShortlistBody';
import ErrorMessage from './components/ErrorMessage';
import { withRouter } from 'react-router';
import axios from 'axios';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBContainer } from 'mdbreact';
import { MDBRow, MDBCol, MDBCardFooter, MDBCardText, MDBCardHeader } from 'mdbreact';
import { MDBTable, MDBInput } from 'mdbreact';
import { getUser } from './utils';
import { socket } from './socket_api';

class NewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "" };
    this.nameInput = React.createRef();
    this.saveClick = this.saveClick.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
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

  saveClick() {
    const shortlist = {
      name: this.props.name.trim(),
      status: 0,
      partner: null
    };

    const dataToSave = {
      user: getUser(), // TO DO change to owner
      shortlist: shortlist,
      list: [...this.props.list]
    };

    axios.post('http://localhost:3003/api/saveList', dataToSave)
      .then(res => {
        this.setState({ error: "" });
        this.props.history.push('/lists');
      })
      .catch(err => {
        this.setState({ error: err });
       });

  }

  cancelClick() {
    // return to the menu
    this.props.history.push('/menu');
  }

  updateRating(list) {
    this.props.updateRating(list);
  }

  submitHandler = event => {
    event.preventDefault();
    event.target.className += " was-validated";
    const regex = /\w+/;
    if (this.props.name.trim() !== "" && regex.test(this.props.name.trim())) {
      this.saveClick();
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
                <ShortlistBody list={this.props.list} updateRating={this.updateRating} />
                <div className="d-flex justify-content-end">
                  <MDBBtn color="secondary" onClick={this.cancelClick}>Cancel</MDBBtn>
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
export default withRouter(NewList);
