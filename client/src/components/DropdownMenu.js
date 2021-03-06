import React from 'react';
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from 'mdbreact';

class DropdownMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const buttonLabel = this.props.isShared ? "Unshare" : "Share";
    const shareFunction = this.props.isShared ? this.props.unshare : this.props.share;
    return (
      <MDBDropdown>
        <MDBDropdownToggle color="primary"><MDBIcon icon="bars" /></MDBDropdownToggle>
        <MDBDropdownMenu basic>
          <MDBDropdownItem onClick={shareFunction}>
            <MDBIcon icon="share-alt" /> { buttonLabel }
            </MDBDropdownItem>
          <MDBDropdownItem onClick={this.props.rename}>
            <MDBIcon icon="pencil-alt" /> Rename
          </MDBDropdownItem>
          <MDBDropdownItem onClick={this.props.remove}>
            <MDBIcon far icon="trash-alt" /> Remove
          </MDBDropdownItem>
        </MDBDropdownMenu>
      </MDBDropdown>
    );
  }
}

export default DropdownMenu;
