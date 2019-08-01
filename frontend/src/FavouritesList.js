import React from 'react';
import ReactStarRatingComponent from 'react-star-rating-component';

class FavouritesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isRatingEnabled: false};
  }
  render() {
    const title = 'Favourite names';
    const rows = [];
    this.props.names.forEach((item) => {
      rows.push(
        <FavouriteNameRow name={item.name} isRatingVisible={this.props.isRatingVisible}/>
      );
    }
    );
    return (
      <table>
      <thead>
        <tr>
          <td>{title}</td>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
    );
  }
}

class FavouriteNameRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rating: 0};
    this.onStarClick = this.onStarClick.bind(this);
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
  }

  render() {
    const name = this.props.name;
    const rating = this.state.rating;
    const isRatingVisible = this.props.isRatingVisible;
    return(
      <tr>
        <td>{name}</td>
        { isRatingVisible && (<td><ReactStarRatingComponent
              name={"rate"+{name}}
              starCount={5}
              value={rating}
              onStarClick={this.onStarClick}
          />
        </td>)}
      </tr>
    );
  }
}

export default FavouritesList;
