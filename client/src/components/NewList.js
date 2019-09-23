import React, { Component } from 'react';
import axios from 'axios';
import { MDBContainer, MDBCard, MDBCardBody, MDBRow, MDBCol } from 'mdbreact';
import NameSorter from './NameSorter';
import GenderChooser from './GenderChooser';
import NewListComponent from './NewListComponent';
import Navbar from './Navbar';
import EmptyList from './EmptyList';
import { getUser } from '../utils/utils';
import { baseUrl } from '../utils/config';


class NewList extends Component {
  constructor(props) {
    super(props);
    this.state = { gender: "", isNameListOver: false, chosenNames: new Map([]), listname: "" };
    this.updateGender = this.updateGender.bind(this);
    this.startAgainClick = this.startAgainClick.bind(this);
    this.endNameSorted = this.endNameSorted.bind(this);
    this.updateChosenNames = this.updateChosenNames.bind(this);
    this.updateRating = this.updateRating.bind(this);
    this.updateListname = this.updateListname.bind(this);
    this.backToMenu = this.backToMenu.bind(this);
    this.saveNewList = this.saveNewList.bind(this);
  }

  startAgainClick() {
    this.setState({gender: "", chosenNames: new Map([]), isNameListOver: false });
  }

  backToMenu() {
    this.props.history.push('/menu');
  }

  updateGender(gender) {
    this.setState({gender: gender});
  }

  endNameSorted() {
    this.setState({isNameListOver: true});
  }

  updateChosenNames(chosenNames) {
    this.setState({ chosenNames: chosenNames });
  }

  updateRating(list) {
    this.setState({ chosenNames: list });
  }

  updateListname(name) {
    this.setState({ listname: name });
  }

  saveNewList() {
    const shortlist = {
      name: this.state.listname.trim(),
      status: 0,
      partner: null
    };

    const dataToSave = {
      user: getUser(), // TO DO change to owner
      shortlist: shortlist,
      list: [...this.state.chosenNames]
    };

    axios.post(baseUrl + '/api/create', dataToSave)//('http://localhost:3003/api/create', dataToSave)
      .then(res => {
        this.setState({ error: "" });
        this.props.history.push('/lists');
      })
      .catch(err => {
        this.setState({ error: err.message });
       });
  }

  render() {
    const gender = this.state.gender;
    const isGenderSet = this.state.gender == '' ? false : true;
    const isNameListOver = this.state.isNameListOver;

    let currentView;
    if (!isGenderSet) {
      currentView = <GenderChooser setGender={this.updateGender}/>;
    } else if (isGenderSet && !isNameListOver) {
        currentView = <NameSorter gender={gender}
                      startAgain={this.startAgainClick}
                      endNameSorted={this.endNameSorted}
                      chosenNames={this.state.chosenNames}
                      updateChosenNames={this.updateChosenNames}
                      />;
    } else if (isGenderSet && isNameListOver && this.state.chosenNames.size > 0) {
      currentView = <NewListComponent list={this.state.chosenNames}
                               name={this.state.listname}
                               updateRating={this.updateRating}
                               updateListname={this.updateListname}
                               backToMenu={this.backToMenu}
                               saveNewList={this.saveNewList}/>;
    } else if (isGenderSet && isNameListOver && this.state.chosenNames.size == 0) {
      currentView = <EmptyList startAgain={this.startAgainClick}
                               backToMenu={this.backToMenu} />
    }

    return(
      <MDBContainer className="w-100 min-vh-100">
        <Navbar activeItem="newlist"/>
         <MDBRow>
           <MDBCol>
             <MDBCard >
               <MDBCardBody className="d-flex justify-content-center">
                 <div className="w-responsive">
                   {currentView}
                 </div>
               </MDBCardBody>
             </MDBCard>
           </MDBCol>
         </MDBRow>
      </MDBContainer>
    );
  }
}

export default NewList;
