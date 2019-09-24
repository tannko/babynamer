import React, { Component } from 'react';
import { MDBTable, MDBTableBody } from 'mdbreact';
import { objectToMap } from '../utils/utils';
import CommonRatingRow from './CommonRatingRow';

class CommonRating extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const shortlist = this.props.shortlist;
    const ownerList = objectToMap(shortlist.owner.list);
    const partnerList = objectToMap(shortlist.partner.list);
    const commonList = new Map([]);
    ownerList.forEach((rating, name) => {
      commonList.set(name, rating + partnerList.get(name));
    });
    const sortedCommonList = new Map([...commonList.entries()].sort((a, b) => b[1] - a[1]));
    const rows = [];
    sortedCommonList.forEach((rating, name) => {
      rows.push(
        <CommonRatingRow key={name} name={name} rating={rating} />
      );
    });
    return (
      <MDBTable scrollY maxHeight="60vh" className="text-left">
        <MDBTableBody>
          {rows}
        </MDBTableBody>
      </MDBTable>
    );
  }
}

export default CommonRating;
