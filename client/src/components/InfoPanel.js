import React from 'react';
import { MDBCard, MDBCardBody, MDBBadge, MDBIcon } from 'mdbreact';

export default function InfoPanel() {

  return(
    <MDBCard>
      <MDBCardBody>
        <div className="d-flex justify-content-center">
          <div className="p-2">
            <MDBBadge color="default">
              <MDBIcon icon="envelope-open-text" size="2x"/>
            </MDBBadge> - Common Rating updated

          </div>
          <div className="p-2">
            <MDBBadge color="warning">
              <MDBIcon icon="share-alt" size="2x"></MDBIcon>
            </MDBBadge> - List is shared
          </div>
          <div className="p-2">
            <MDBBadge color="primary">
              <MDBIcon icon="lock" size="2x"></MDBIcon>
            </MDBBadge> - List is private (not shared)
          </div>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}
