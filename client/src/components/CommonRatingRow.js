import React from 'react';
import ReactStarRatingComponent from 'react-star-rating-component';

function CommonRatingRow(props) {
  return(
    <tr>
      <td>{props.name}</td>
      <td>
        <ReactStarRatingComponent
            name={props.name}
            starCount={10}
            value={props.rating}
            />
      </td>
      <td>({props.rating})</td>
    </tr>
    );
}

export default CommonRatingRow;
