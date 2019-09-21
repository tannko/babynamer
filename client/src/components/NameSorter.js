import React from 'react';
import axios from 'axios';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBContainer } from 'mdbreact';
import { MDBRow, MDBCol, MDBCardFooter, MDBCardText, MDBCardHeader } from 'mdbreact';
import { MDBProgress, MDBIcon } from 'mdbreact';
import { baseUrl } from '../utils/config';

class NameSorter extends React.Component {
  constructor(props) {
    super(props);

    this.state = { nameToShowIndex: 0, names: [], progress: 0, error: "" };
    this.yesHandleClick = this.yesHandleClick.bind(this);
    this.moveIndex = this.moveIndex.bind(this);
    this.saveClick = this.saveClick.bind(this);
  }

  componentDidMount() {
    const gender = this.props.gender;
    axios.get(baseUrl + '/api/gender/' + this.props.gender).//('http://localhost:3003/api/gender/' + this.props.gender).
      then( response => {
        this.setState({ names: response.data });
      }).
      catch( error => {
        this.setState({ error: error.message });
      })
  }

  yesHandleClick() {
    const name = this.state.names[this.state.nameToShowIndex].name;
    const chosenNames = new Map(this.props.chosenNames);
    chosenNames.set(name, 0);
    this.props.updateChosenNames(chosenNames);
    this.moveIndex();
  }

  moveIndex() {
    const nextIndex = this.state.nameToShowIndex + 1;
    if (nextIndex < this.state.names.length) {
      this.setState({ nameToShowIndex: nextIndex });
    } else {
        this.props.endNameSorted();
    }
    this.setState({ progress: nextIndex * 100 / this.state.names.length, errorMessage: "" });
  }

  saveClick() {
    if (this.props.chosenNames.size == 0) {
      this.setState({ error: "You should pick at least ONE name to save the shortlist" });
    } else
      this.props.endNameSorted();
  }

  render() {
    const nameIndex = this.state.nameToShowIndex;
    const names = this.state.names;
    const name = names.length == 0 ? "" : names[nameIndex].name;
    const meaning = names.length == 0 ? "" : names[nameIndex].meaning;
    const favourNames = this.props.chosenNames;
    const nameForm = favourNames.size == 1 ? " name" : " names";
    const countNames = "You have " + favourNames.size + nameForm + " in your shortlist";
    const btnClass = names.length == 0 ? "disabled" : "";
    return (
            <MDBCard>
              <MDBCardHeader className="d-flex align-items-center justify-content-end">
                <MDBBtn className="mr-auto" onClick={this.props.startAgain}><MDBIcon icon="redo-alt"/></MDBBtn>
                <div class="text-center">{this.state.error}</div>
                <MDBBtn onClick={this.saveClick}>SAVE</MDBBtn>
              </MDBCardHeader>
              <MDBCardBody className="text-center">
                <MDBCardTitle>{name}</MDBCardTitle>
                <MDBCardText>{meaning}</MDBCardText>
                <MDBBtn className={btnClass} onClick={this.moveIndex}>NO</MDBBtn>
                <MDBBtn className={btnClass} onClick={this.yesHandleClick}>YES</MDBBtn>
              </MDBCardBody>
              <MDBCardFooter>
                <MDBProgress value={this.state.progress} />
                {countNames}
              </MDBCardFooter>
            </MDBCard>


    );
  }
}

export default NameSorter;
