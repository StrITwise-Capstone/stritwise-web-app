import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const textField = ({
  field,
  form: { touched, errors },
  ...props
}) => {
  const {
    autoComplete,
    label,
    disabled,
    type,
    multiline,
    rows,
    rowsMax,
    fullWidth,
    required,
    style,
  } = props;

  const hasError = !!(touched[field.name] && errors[field.name]);
  return (
    <TextField
      required={required}
      disabled={disabled}
      error={hasError}
      helperText={hasError && errors[field.name]}
      autoComplete={autoComplete}
      label={label}
      type={type}
      name={field.name}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      multiline={multiline}
      rows={rows}
      rowsMax={rowsMax}
      fullWidth={fullWidth}
      style={style}
    />
  );
};

textField.propTypes = {
  field: PropTypes.shape({
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  }).isRequired,
  autoComplete: PropTypes.string,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['email', 'password', 'text']),
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  rowsMax: PropTypes.number,
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
};

textField.defaultProps = {
  disabled: false,
  autoComplete: '',
  type: 'text',
  multiline: false,
  rows: 3,
  rowsMax: 5,
  fullWidth: false,
  required: false,
};

export default (textField);
