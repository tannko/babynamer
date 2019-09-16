import React from 'react';
import { MDBCard, MDBCardBody, MDBCardText, MDBBtn, MDBIcon, MDBTooltip } from 'mdbreact';

function EmptyList(props) {
  return(
    <MDBCard>
      <MDBCardBody>
        <MDBCardText>
          Names list is ended. You should pick at least one name to save the list.
          Now you can go back to the menu or start name picking again.
        </MDBCardText>
        <div className="d-flex justify-content-center">
          <MDBBtn color="secondary" onClick={props.backToMenu}><MDBIcon icon="arrow-left" size="2x" /></MDBBtn>
          <MDBBtn color="primary" onClick={props.startAgain}><MDBIcon icon="redo-alt" size="2x"/></MDBBtn>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}

export default EmptyList;
