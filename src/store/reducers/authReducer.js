const initState = {
  authError: null,
  userRole: null,
};
const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN_ERROR':
      console.log('Login error');
      return {
        ...state,
        authError: 'Login Failed',
      };
    case 'LOGIN_SUCCESS':
      console.log('login success');
      return {
        ...state,
        authError: null,
      };
    case 'LOGOUT_SUCCESS':
      console.log('logout success');
      return {
        ...state,
        authError: null,
        userRole: null,
      };
    case 'SIGNUP_SUCCESS':
      console.log('signup success');
      return {
        ...state,
        authError: null,
      };
    case 'SIGNUP_ERROR':
      console.log('signup error');
      return {
        ...state,
        authError: action.err.message,
      };
    case 'RETRIEVE_USER':
      console.log('retrieve user success');
      return {
        ...state,
        userRole: action.userRole,
      };
    default:
      return state;
  }
};

export default authReducer;
