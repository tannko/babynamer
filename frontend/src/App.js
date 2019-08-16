import React, {Component} from 'react';
import { MDBContainer } from 'mdbreact';
import NameSorter from './NameSorter';
import GenderChooser from './GenderChooser';
import ShortList from './ShortList';
import Navbar from './Navbar';


class App extends Component {
  constructor() {
    super();
    this.state = {gender: '', isNameListOver: false, chosenNames: new Map([]), listname: "My Shortlist"};
    this.genderClick = this.genderClick.bind(this);
    this.backClick = this.backClick.bind(this);
    this.endNameSorted = this.endNameSorted.bind(this);
    this.updateChosenNames = this.updateChosenNames.bind(this);
    this.updateRating = this.updateRating.bind(this);
    this.updateListname = this.updateListname.bind(this);
  }

  backClick() {
    this.setState({gender: ''});
  }

  genderClick(gender) {
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

  render() {
    const gender = this.state.gender;
    const isGenderSet = this.state.gender == '' ? false : true;
    const isNameListOver = this.state.isNameListOver;

    let currentView;
    if (!isGenderSet) {
      currentView = <GenderChooser onClick={this.genderClick}/>;
    } else if (isGenderSet && !isNameListOver) {
        currentView = <NameSorter gender={gender}
                      backClick={this.backClick}
                      endNameSorted={this.endNameSorted}
                      chosenNames={this.state.chosenNames}
                      updateChosenNames={this.updateChosenNames}
                      />;
    } else if (isGenderSet && isNameListOver) {
      currentView = <ShortList list={this.state.chosenNames}
                               name={this.state.listname}
                               updateRating={this.updateRating}
                               updateListname={this.updateListname}/>;
    }

    return(
      <MDBContainer className="min-vh-100 align-items-center justify-content-center">
        <Navbar activeItem="newlist"/>
          <div>
            {currentView}
          </div>
      </MDBContainer>
    );
  }
}

export default App;
