import React from 'react';
import axios from 'axios';
import { MDBCard, MDBCardBody, MDBContainer } from 'mdbreact';
import { MDBRow, MDBCol } from 'mdbreact';
import { getUser } from '../utils/utils';
import ShortlistEditor from './ShortlistEditor';
import Navbar from './Navbar';
import ErrorMessage from './ErrorMessage';
import { baseUrl } from '../utils/config';
import InfoPanel from './InfoPanel';

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
    axios.get(baseUrl + '/api/lists/' + user._id)//('http://localhost:3003/api/lists/' + user._id)
      .then( response => {
        this.setState({ lists: response.data, error: "" });
      })
      .catch( error => {
        this.setState({ error: error.message });
      });
  }

  render() {
    const rows = [];
    const isError = this.state.error === "" ? false : true;
    this.state.lists.forEach( list => {
      rows.push(
        <MDBCol md="4" key={list.name}>
          <ShortlistEditor shortlist={list} editor={'owner'} updateAll={this.getData} key={list.name}/>
        </MDBCol>
      );
    });
    return(
      <MDBContainer className="min-vh-100 align-items-center justify-content-center">
        <Navbar activeItem="lists"/>
        { isError && <div><ErrorMessage message={this.state.error}/></div> }
        <MDBRow>
          <MDBCol>
            <InfoPanel />
          </MDBCol>
        </MDBRow>
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
