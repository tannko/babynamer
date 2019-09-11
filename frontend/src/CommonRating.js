import React, { Component } from 'react';
import ReactStarRatingComponent from 'react-star-rating-component';
import { MDBTable } from 'mdbreact';
import { objectToMap } from './utils';

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
        <tr>
          <td>{name}</td>
          <td>
            <ReactStarRatingComponent
                name={name}
                starCount={10}
                value={rating}
                />
          </td>
          <td>({rating})</td>
        </tr>
      );
    });
    return (
      <MDBTable scrollY maxHeight="60vh" className="text-left">
        {rows}
      </MDBTable>
    );
  }
}

export default CommonRating;
