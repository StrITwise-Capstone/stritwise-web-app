import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

const textField = (props) => {
  const {
    name,
    onChange,
    label,
    errors,
    values,
    type,
    required,
  } = props;
  const error = errors[name];
  const value = values[name];
  return (
    <TextField
      required={required}
      error={error}
      helperText={error}
      label={label}
      type={type}
      name={name}
      onChange={onChange}
      value={value}
    />
  );
};

textField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['email', 'password', 'text']),
  errors: PropTypes.objectOf(PropTypes.string),
  values: PropTypes.objectOf(PropTypes.string).isRequired,
  required: PropTypes.bool,
};

textField.defaultProps = {
  type: 'text',
  errors: { },
  required: false,
};

export default textField;
