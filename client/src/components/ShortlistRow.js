import React from 'react';
import ReactStarRatingComponent from 'react-star-rating-component';

function ShortlistRow(props) {
  return(
      <tr>
        <td>{props.name}</td>
        <td>
          <ReactStarRatingComponent
              name={props.name}
              starCount={5}
              value={props.rating}
              onStarClick={(nextValue, prevValue, name) => props.starClick(nextValue, prevValue, name)}/>
        </td>
      </tr>
    );
}

export default ShortlistRow;
