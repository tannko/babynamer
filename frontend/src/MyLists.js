import React from 'react';
import axios from 'axios';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBContainer } from 'mdbreact';
import { MDBRow, MDBCol, MDBCardFooter, MDBCardText, MDBCardHeader } from 'mdbreact';
import { MDBCardImage } from 'mdbreact';
import { getUser } from './utils';
import ShortList from './ShortList';
import ModalList from './ModalList';

class MyLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lists: [] };
    this.updateRating = this.updateRating.bind(this);
  }

  componentDidMount() {
    const user = getUser();
    axios.get('http://localhost:3003/api/lists/' + user._id)
      .then( response => {
        this.setState({ lists: response.data });
      })
      .catch( error => {

      });
  }

  updateRating(list) {
    const updatedLists = JSON.parse(JSON.stringify(this.state.lists));
    for (var item of updatedLists) {
      if (item._id === list._id) { // what if we have two lists with the same name??
        updatedLists[updatedLists.indexOf(item)] = list;
        break;
      }
    }
    this.setState({ lists: updatedLists });
  }

  render() {
    const qty = this.state.lists.length;
    const rows = [];
    const btnStyle = {
      'border-radius' : '50%'
    };
    const ratingLabel = this.state.ratingLabel;
    this.state.lists.forEach( list => {
      rows.push(
        <MDBCol>
          <ModalList shortlist={list} updateRating={this.updateRating} shared={false}/>
        </MDBCol>
      );
    });
    return(
      <MDBContainer className="min-vh-100 align-items-center justify-content-center">
        <div className="card-deck">
          {rows}
        </div>
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
