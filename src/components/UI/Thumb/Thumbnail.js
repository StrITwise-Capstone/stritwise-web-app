import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Thumb extends Component {
  state = {
    loading: false,
    thumb: undefined,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.file) { return; }

    this.setState({ loading: true }, () => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.setState({ loading: false, thumb: reader.result });
      };

      reader.readAsDataURL(nextProps.file);
    });
  }

  render() {
    const { file } = this.props;
    const { loading, thumb } = this.state;

    if (!file) { return null; }

    if (loading) { return <p>loading...</p>; }

    return (
      <div
        style={{alignItems: 'center', display: 'flex', margin: '1em' }}
      >
        <img
          src={thumb}
          alt={file.name}
          className="img-thumbnail mt-2"
          height={300}
          width={480}
          style={{ margin: 'auto' }}
        />
      </div>
    );
  }
}
Thumb.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  file: PropTypes.any,
  /* eslint-enable */
};

Thumb.defaultProps = {
  file: null,
};

export default Thumb;
