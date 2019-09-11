import React from 'react';
import { MDBCard, MDBCardHeader, MDBBadge, MDBIcon } from 'mdbreact';
import { MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdbreact';

function ListCard(props) {
  return (
    <a onClick={props.toggle}>
      <MDBCard className="mt-3">
        <MDBCardHeader>
        {
          props.isShared ?
            <div className="d-flex justify-content-end">
              {
                props.isCommonRatingUpdated &&
                  <MDBBadge color="default">
                    <MDBIcon icon="envelope-open-text" size="2x" />
                  </MDBBadge>
              }

              <MDBBadge color="warning">
                <MDBIcon icon="share-alt" size="2x" />
              </MDBBadge>
            </div>
          :
            <div className="d-flex justify-content-end">
              <MDBBadge color="primary">
                <MDBIcon icon="lock" size="2x"/>
              </MDBBadge>
            </div>
        }
        </MDBCardHeader>

        <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg"/>
        <MDBCardBody>
          <MDBCardTitle>{props.name}</MDBCardTitle>
          <MDBCardText> has {props.size} names </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </a>
  );
}

export default ListCard;
