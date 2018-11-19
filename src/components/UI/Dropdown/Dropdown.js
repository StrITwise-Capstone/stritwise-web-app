import React from 'react';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

const dropdown = ({
  field,
  form: { touched, errors },
  ...props
}) => {
  const {
    label,
    required,
    children,
  } = props;
  const hasError = !!(touched[field.name] && errors[field.name]);
  return (
    <div>
      <FormControl error={hasError} required={required}>
        <InputLabel shrink={field.value !== ''}>{label}</InputLabel>
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
  required: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

dropdown.defaultProps = {
  required: false,
};

export default dropdown;
