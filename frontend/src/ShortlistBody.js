import React from 'react';
import ReactStarRatingComponent from 'react-star-rating-component';
import { MDBTable } from 'mdbreact';

class ShortlistBody extends React.Component {
  constructor(props) {
    super(props);
    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleSharedStarClick = this.handleSharedStarClick.bind(this);
  }

  handleStarClick(nextValue, prevValue, name) {
    const list = JSON.parse(JSON.stringify(this.props.list));
    for (var item of list) {
      if (item.babyname.name === name) {
          item.rating = nextValue;
          break;
      }
    }
    this.props.updateRating(list);
  }

  handleSharedStarClick(nextValue, prevValue, name) {
    const list = JSON.parse(JSON.stringify(this.props.list));
    for (var item of list) {
      if (item.babyname.name === name) {
        item.ratingFromShare = nextValue;
        break;
      }
    }
    this.props.updateRating(list);
  }

  render() {
    const rows = [];
    if (this.props.shared) {
      this.props.list.forEach( item => {
        rows.push(<SharedListRow name={item.babyname.name}
                                 rating={item.rating}
                                 ratingFromShare={item.ratingFromShare}
                                 starClick={this.handleSharedStarClick} />);
      });
    } else {
      this.props.list.forEach((item) => {
        rows.push(<ShortListRow name={item.babyname.name}
                                rating={item.rating}
                                ratingFromShare={item.ratingFromShare}
                                starClick={this.handleStarClick}/>);
      });
    }

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
    const ratingFromShare = this.props.ratingFromShare;
    const commonRating = ratingFromShare == 0 ? "" : ratingFromShare + rating;
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
        <td>{commonRating}</td>
      </tr>
    );
  }
}

class SharedListRow extends React.Component {
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

export default ShortlistBody;
