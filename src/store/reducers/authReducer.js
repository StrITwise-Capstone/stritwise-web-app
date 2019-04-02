import * as actionTypes from '../actions/actionTypes';

const initState = {
  isAuthenticated: false,
  userRole: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_LOGIN:
      return {
        ...state,
        isAuthenticated: true,
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        userRole: null,
      };
    case actionTypes.RETRIEVE_USER:
      return {
        ...state,
        userRole: action.userRole,
        isAuthenticated: action.isAuthenticated,
      };
    default:
      return state;
  }
};

export default authReducer;
