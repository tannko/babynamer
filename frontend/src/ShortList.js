import React from 'react';
//import ReactStarRatingComponent from 'react-star-rating-component';
import ShortlistRow from './components/ShortlistRow';
import { withRouter } from 'react-router';
import axios from 'axios';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBContainer } from 'mdbreact';
import { MDBRow, MDBCol, MDBCardFooter, MDBCardText, MDBCardHeader } from 'mdbreact';
import { MDBTable, MDBInput } from 'mdbreact';
import { getUser } from './utils';
import { socket } from './socket_api';

class ShortList extends React.Component {
  constructor(props) {
    super(props);
    this.nameInput = React.createRef();
    this.saveClick = this.saveClick.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
    this.starClick = this.starClick.bind(this);
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
    // TO DO
    // add form checker: name is not empty
    const shortlist = {
      name: this.props.name.trim(),
      status: 0,
      partner: null
    };

    //const list = new Map();
    //list.set('name', 0);
    const dataToSave = {
      user: getUser(), // TO DO change to owner
      shortlist: shortlist,
      list: [...this.props.list]
    };
    //socket.emit("testSaveList", dataToSave);

    axios.post('http://localhost:3003/api/saveList', dataToSave)
      .then(res => {
        // move to my lists page
        this.props.history.push('/lists');
      })
      .catch(err => {
        // show modal about error with saving
        //console.log(err);
       });

  }

  cancelClick() {
    // return to the menu
    this.props.history.push('/menu');
  }

  starClick(nextValue, prevValue, name) {
    const list = new Map(this.props.list);
    list.set(name, nextValue);
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
    const rows = [];
    this.props.list.forEach((rating, name) => {
      rows.push(<ShortlistRow name={name} rating={rating}
        starClick={this.starClick}/>);
    });

    const size = this.props.list.size;
    const count = size > 1 ? size + " names" : size + " name";

    return (
        <form
          className="needs-validation"
          onSubmit={this.submitHandler}
          noValidate
          >

            <MDBCard>
              <MDBCardBody className="text-center">
                <MDBCardTitle className="text-center">
                  <MDBInput inputRef={ref => this.nameInput = ref} label="Your list name" size="lg" name="title" onInput={this.handleInput} required pattern="\w+">
                    <div className="invalid-feedback">
                      Please add valid list name. List name can contain letters, numbers and underscore.
                    </div>
                  </MDBInput>
                </MDBCardTitle>
                <MDBTable scrollY maxHeight="60vh" className="text-left">
                  {rows}
                </MDBTable>
                <MDBBtn color="secondary" onClick={this.cancelClick}>Cancel</MDBBtn>
                <MDBBtn color="primary" type="submit">Save</MDBBtn>
                <div>{count}</div>
              </MDBCardBody>
            </MDBCard>

        </form>

    );
  }
}

export default withRouter(ShortList);
