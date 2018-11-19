import React from 'react';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

const dropdown = (props) => {
  const {
    name,
    onChange,
    onBlur,
    label,
    errors,
    values,
    touched,
    required,
    children,
  } = props;
  const error = errors[name];
  const isTouched = touched[name];
  const value = values[name];
  const hasError = error && isTouched;
  return (
    <FormControl error={hasError} required={required}>
      <InputLabel shrink={value !== ''}>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        name={name}
        onBlur={onBlur}
      >
        {children}
      </Select>
      {hasError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

dropdown.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  errors: PropTypes.objectOf(PropTypes.string),
  touched: PropTypes.objectOf(PropTypes.bool).isRequired,
  values: PropTypes.objectOf(PropTypes.string).isRequired,
  required: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

dropdown.defaultProps = {
  errors: { },
  required: false,
};

export default dropdown;
