import React from 'react';
import axios from 'axios';
import { getUser } from './utils';
import { MDBContainer, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdbreact';
import { MDBCardFooter, MDBCardHeader } from 'mdbreact';
import Invitation from './Invitation';

class SharedWithMe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedLists: [],
      timestamp: 0
    };
  }

  componentDidMount() {
    const user = getUser();
    axios.get('http://localhost:3003/shared/' + user._id)
      .then( response => {
        this.setState({ sharedLists: response.data });
      })
      .catch( error => {
        // show modal with error message
      });
  }

  rerender() {
    this.setState({ timestamp: Date.now() });
  }

  render() {
    const rows = [];
    this.state.sharedLists.forEach( list => {
      const status = list.sharedWith.status;
      // sharing is pending
      if (status === 0) {
        rows.push(
          <Invitation list={list} rerender={this.rerender} />
        );
      } else {
        rows.push(
          <MDBCol>
            <MDBCard>
              <MDBCardBody>
                <MDBCardTitle>{list.name}</MDBCardTitle>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        );
      }

    });
    return (
      <MDBContainer>
        <div class="card-deck">
          {rows}
        </div>
      </MDBContainer>
    );
  }
}

export default SharedWithMe;
