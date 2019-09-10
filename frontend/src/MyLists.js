import React from 'react';
import axios from 'axios';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBContainer } from 'mdbreact';
import { MDBRow, MDBCol, MDBCardFooter, MDBCardText, MDBCardHeader } from 'mdbreact';
import { MDBCardImage } from 'mdbreact';
import { getUser } from './utils';
import ShortList from './ShortList';
import ModalList from './ModalList';
import Navbar from './Navbar';
import ErrorMessage from './ErrorMessage';
import { socket } from './socket_api';

class MyLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lists: [], error: "" };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();

  }

  getData() {
    const user = getUser();
    axios.get('http://localhost:3003/api/lists/' + user._id)
      .then( response => {
        this.setState({ lists: response.data, error: "" });
      })
      .catch( error => {
        this.setState({ error: error });
      });
  }

  render() {
    const qty = this.state.lists.length;
    const rows = [];
    const btnStyle = {
      'border-radius' : '50%'
    };
    const isError = this.state.error === "" ? false : true;
    this.state.lists.forEach( list => {
      rows.push(
        <MDBCol md="4">
          <ModalList shortlist={list} editor={'owner'} updateAll={this.getData}/>
        </MDBCol>
      );
    });
    return(
      <MDBContainer className="min-vh-100 align-items-center justify-content-center">
        <Navbar activeItem="lists"/>
        { isError && <div><ErrorMessage message={this.state.error}/></div> }
        <MDBRow>
          <MDBCol>
            <MDBCard>
              <MDBCardBody>
                <div className="card-deck">
                  {rows}
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default MyLists;

/*
<a href="#" onClick={this.handleListClick}>
<MDBCard className="mt-3">
  <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg" />
    <MDBCardBody>
      <MDBCardTitle>{list.name}</MDBCardTitle>
      <MDBCardText> timestamp </MDBCardText>
    </MDBCardBody>
</MDBCard>
</a>

*/
