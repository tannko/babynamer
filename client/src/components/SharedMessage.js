import React from 'react';

function SharedMessage(props) {
  return(
    props.isShared ?
    <div className="d-flex flex-grow-1 justify-content-center">
        { "You shared this list with " + props.partner }
    </div>
      :
    <div className="d-flex flex-grow-1"></div>
  );
}

export default SharedMessage;
