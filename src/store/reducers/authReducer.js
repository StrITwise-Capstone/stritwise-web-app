import * as actionTypes from '../actions/actionTypes';

export const MESSAGE_ERROR = 'MESSAGE_ERROR';
export const MESSAGE_WARNING = 'MESSAGE_WARNING';
export const MESSAGE_SUCCESS = 'MESSAGE_SUCCESS';

const initState = {
  authError: null,
  message: '',
  messageType: MESSAGE_ERROR,
  isAuthenticated: false,
  userRole: null,
  issubmitting: false,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_ERROR:
      return {
        ...state,
        authError: 'Login Failed',
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        authError: null,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        authError: null,
        isAuthenticated: false,
        userRole: null,
      };
    case actionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        authError: null,
      };
    case actionTypes.SIGNUP_ERROR:
      return {
        ...state,
        authError: action.err.message,
      };
    case actionTypes.RETRIEVE_USER:
      return {
        ...state,
        userRole: action.userRole,
      };
    case actionTypes.AUTH_ERROR_MESSAGE:
      return {
        ...state,
        message: action.message || 'Something went wrong!',
        messageType: action.messageType,
      };
    default:
      return state;
  }
};

export default authReducer;
