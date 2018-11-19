import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const textField = ({
  field,
  form: { touched, errors },
  ...props
}) => {
  const {
    autoComplete,
    label,
    type,
    required,
  } = props;
  const hasError = !!(touched[field.name] && errors[field.name]);
  return (
    <div>
      <TextField
        required={required}
        error={hasError}
        helperText={hasError && errors[field.name]}
        autoComplete={autoComplete}
        label={label}
        type={type}
        name={field.name}
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
      />
    </div>
  );
};

textField.propTypes = {
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
  type: PropTypes.oneOf(['email', 'password', 'text']),
  required: PropTypes.bool,
};

textField.defaultProps = {
  autoComplete: '',
  type: 'text',
  required: false,
};

export default textField;
