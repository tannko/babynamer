import React from 'react';
import ShortlistRow from './ShortlistRow';
import { MDBTable, MDBTableBody } from 'mdbreact';

class ShortlistBody extends React.Component {
  constructor(props) {
    super(props);
    this.handleStarClick = this.handleStarClick.bind(this);
  }

  handleStarClick(nextValue, prevValue, name) {
    const list =  new Map(this.props.list);
    list.set(name, nextValue);
    this.props.updateRating(list);
  }

  render() {
    const rows = [];
    this.props.list.forEach((rating, name) => {
        rows.push(<ShortlistRow key={name} name={name}
                                rating={rating}
                                starClick={this.handleStarClick} />);
      });

    return(
      <MDBTable scrollY maxHeight="60vh" className="text-left">
        <MDBTableBody>
          {rows}
        </MDBTableBody>
      </MDBTable>
    );
  }
}
export default ShortlistBody;
