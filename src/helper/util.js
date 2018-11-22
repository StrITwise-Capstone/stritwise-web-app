/* eslint-disable import/prefer-default-export */
export const isObjectEmpty = object => (
  Object.keys(object).length === 0 && object.constructor === Object
);

export const isFormValid = (errors, touched) => (
  !isObjectEmpty(errors) || isObjectEmpty(touched)
);
/* eslint-enable */
