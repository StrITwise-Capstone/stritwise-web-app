import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

const textField = (props) => {
  const {
    name,
    onChange,
    onBlur,
    autoComplete,
    label,
    errors,
    values,
    type,
    touched,
    required,
  } = props;
  const value = values[name];
  const isTouched = touched[name];
  const error = errors[name];
  const hasError = error && isTouched;
  return (
    <TextField
      required={required}
      error={hasError}
      helperText={hasError ? error : null}
      autoComplete={autoComplete}
      label={label}
      type={type}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
    />
  );
};

textField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  autoComplete: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['email', 'password', 'text']),
  errors: PropTypes.objectOf(PropTypes.string),
  touched: PropTypes.objectOf(PropTypes.bool).isRequired,
  values: PropTypes.objectOf(PropTypes.string).isRequired,
  required: PropTypes.bool,
};

textField.defaultProps = {
  autoComplete: '',
  type: 'text',
  errors: { },
  required: false,
};

export default textField;
