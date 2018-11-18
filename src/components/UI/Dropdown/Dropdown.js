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
    label,
    errors,
    values,
    required,
    children,
  } = props;
  const error = errors[name];
  const value = values[name];
  return (
    <FormControl error={error} required={required}>
      <InputLabel shrink={value}>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        name={name}
      >
        {children}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

dropdown.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  errors: PropTypes.objectOf(PropTypes.string),
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  required: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

dropdown.defaultProps = {
  errors: { },
  required: false,
};

export default dropdown;
