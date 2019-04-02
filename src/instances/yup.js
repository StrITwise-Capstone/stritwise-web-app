import * as yup from 'yup';

/* eslint func-names: ["error", "never"], prefer-arrow-callback: "off" */

// Reference
// function singleSelectRequired(message) {
//   return this.test('singleSelectRequired', message, function (value) {
//     // const { path, value, createError } = this;
//     // const { some, more, args } = anyArgsYouNeed;
//     // [value] - value of the property being tested
//     // [path]  - property name,
//     // return false = error, true = valid.
//     return true;
//   });
// }

function singleSelectRequired(message) {
  return this.test('singleSelectRequired', message, function (value) {
    let newArray = value;
    if (!(value instanceof Array)) {
      newArray = [value];
    }
    return newArray.length === 1 && value !== undefined;
  });
}

/* eslint-enable */

yup.addMethod(yup.mixed, 'singleSelectRequired', singleSelectRequired);

export default yup;
