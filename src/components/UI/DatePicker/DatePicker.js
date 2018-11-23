import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const datePicker = ({
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
  } = props;
  const hasError = !!(touched[field.name] && errors[field.name]);
  return (
    <div>
      <TextField
        required={required}
        disabled={disabled}
        error={hasError}
        helperText={hasError && errors[field.name]}
        autoComplete={autoComplete}
        label={label}
        type="datetime-local"
        name={field.name}
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        multiline={multiline}
        rows={rows}
        rowsMax={rowsMax}
        fullWidth={fullWidth}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
  );
};

datePicker.propTypes = {
  field: PropTypes.shape({
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  }).isRequired,
  form: PropTypes.shape({
    touched: PropTypes.objectOf(PropTypes.bool),
    errors: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  autoComplete: PropTypes.string,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  rowsMax: PropTypes.number,
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
};

datePicker.defaultProps = {
  disabled: false,
  autoComplete: '',
  type: 'datetime-local',
  multiline: false,
  rows: 3,
  rowsMax: 5,
  fullWidth: true,
  required: false,
  id:"datetime-local",
  defaultValue:"2017-05-24T10:30",
};

export default (datePicker);
