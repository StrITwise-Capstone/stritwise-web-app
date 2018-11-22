import React from 'react';
import PropTypes from 'prop-types';
import {
  FormHelperText,
  InputLabel,
  Select,
  FormControl,
} from '@material-ui/core';

const dropdown = ({
  field,
  form: { touched, errors },
  ...props
}) => {
  const {
    label,
    disabled,
    multiple,
    fullWidth,
    required,
    children,
  } = props;
  const hasError = !!(touched[field.name] && errors[field.name]);
  return (
    <div>
      <FormControl
        disabled={disabled}
        error={hasError}
        equired={required}
        fullWidth={fullWidth}
        multiple={multiple}
      >
        <InputLabel shrink={field.value !== ''}>
          {label}
        </InputLabel>
        <Select
          value={field.value}
          onChange={field.onChange}
          name={field.name}
          onBlur={field.onBlur}
        >
          {children}
        </Select>
        {hasError && <FormHelperText>{hasError && errors[field.name]}</FormHelperText>}
      </FormControl>
    </div>
  );
};

dropdown.propTypes = {
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
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

dropdown.defaultProps = {
  disabled: false,
  multiple: false,
  fullWidth: true,
  required: false,
};

export default dropdown;
