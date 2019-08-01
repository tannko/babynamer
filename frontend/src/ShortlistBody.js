import React from 'react';
import ReactStarRatingComponent from 'react-star-rating-component';
import { MDBTable } from 'mdbreact';

class ShortlistBody extends React.Component {
  constructor(props) {
    super(props);
    this.handleStarClick = this.handleStarClick.bind(this);
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

  render() {
    const rows = [];
    this.props.list.forEach((item) => {
      rows.push(<ShortListRow name={item.babyname.name} rating={item.rating}
        starClick={this.handleStarClick}/>);
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
    //this.setState({rating: nextValue});
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

export default ShortlistBody;
