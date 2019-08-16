import React from 'react';
import ReactStarRatingComponent from 'react-star-rating-component';
import { MDBTable } from 'mdbreact';

class ShortlistBody extends React.Component {
  constructor(props) {
    super(props);
    this.handleStarClick = this.handleStarClick.bind(this);
    //this.handleSharedStarClick = this.handleSharedStarClick.bind(this);
  }

  handleStarClick(nextValue, prevValue, name) {
    const list =  new Map(this.props.list);
    list.set(name, nextValue);
    this.props.updateRating(list);
  }

  render() {
    const rows = [];

      this.props.list.forEach((rating, name) => {
        rows.push(<ShortListRow name={name}
                                rating={rating}
                                starClick={this.handleStarClick} />);
      });

    return(
      <MDBTable scrollY maxHeight="60vh" className="text-left">
        {rows}
      </MDBTable>
    );
  }
}

class ShortListRow extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {rating: 0};
    this.onStarClick = this.onStarClick.bind(this);
  }

  onStarClick(nextValue, prevValue, name) {
    this.props.starClick(nextValue, prevValue, name);
  }

  render() {
    const name = this.props.name;
    const rating = this.props.rating;
    return(
      <tr>
        <td>{name}</td>
        <td>
          <ReactStarRatingComponent
              name={name}
              starCount={5}
              value={rating}
              onStarClick={this.onStarClick}/>
        </td>
      </tr>
    );
  }
}

/*<td>{commonRating}</td>*/

/*class SharedListRow extends React.Component {
  constructor(props) {
    super(props);
    this.onStarClick = this.onStarClick.bind(this);
  }

  onStarClick(nextValue, prevValue, name) {
    this.props.starClick(nextValue, prevValue, name);
  }

  render() {
    const name = this.props.name;
    const rating = this.props.rating;
    const ratingFromShare = this.props.ratingFromShare;
    const commonRating = ratingFromShare == 0 ? "" : ratingFromShare + rating;
    return(
      <tr>
        <td>{name}</td>
        <td>
          <ReactStarRatingComponent
              name={name}
              starCount={5}
              value={ratingFromShare}
              onStarClick={this.onStarClick}
              />
        </td>
        <td>{commonRating}</td>
      </tr>
    );
  }
}
*/
export default ShortlistBody;
