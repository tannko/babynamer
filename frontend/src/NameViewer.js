import React from 'react';
class NameViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const name = this.props.name;
    const meaning = this.props.meaning;
    return(
      <div>
    <div>{name}</div>
    <div>{meaning}</div>
        </div>
    );
  }
}

export default NameViewer;
