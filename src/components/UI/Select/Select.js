import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';

import styles from './Select.styles';
import components from './selectCustomComponents';

const select = ({
  field,
  form: {
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
  },
  ...props
}) => {
  const {
    autoComplete,
    label,
    fullWidth,
    classes,
    theme,
    options,
    isLoading,
    isMulti,
    required,
  } = props;
  const hasError = !!(touched[field.name] && errors[field.name]);

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };
  return (
    <div>
      <Select
        classes={classes}
        styles={selectStyles}
        options={options}
        components={components}
        onChange={option => setFieldValue(field.name, option)}
        onBlur={() => setFieldTouched(field.name, true)}
        value={field.value}
        name={field.name}
        textFieldProps={{
          InputLabelProps: {
            shrink: touched[field.name] || field.value != null,
          },
          error: hasError,
          helperText: hasError && errors[field.name],
          autoComplete,
          label,
          fullWidth,
          required,
        }}
        isLoading={isLoading}
        placeholder=""
        isMulti={isMulti}
      />
    </div>

  );
};


select.propTypes = {
  field: PropTypes.shape({
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
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
  isMulti: PropTypes.bool,
  required: PropTypes.bool,
  /* eslint-disable react/forbid-prop-types */
  classes: PropTypes.any.isRequired,
  theme: PropTypes.any.isRequired,
  options: PropTypes.any.isRequired,
  /* eslint-enable */
};

select.defaultProps = {
  autoComplete: '',
  fullWidth: true,
  isLoading: false,
  isMulti: false,
  required: false,
};

export default withStyles(styles, { withTheme: true })(select);
