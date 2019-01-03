import * as actionTypes from './actionTypes';

export const logIn = () => ({ type: actionTypes.AUTH_LOGIN });

export const logOut = () => ((dispatch, getstate, { getFirebase }) => {
  const firebase = getFirebase();

  firebase.auth().signOut().then(() => {
    dispatch({ type: actionTypes.AUTH_LOGOUT });
  });
});

export const retrieveUser = authId => (dispatch, getState, { getFirestore }) => {
  let userRole = null;
  console.log(authId);
  if (authId) {
    const firestore = getFirestore();
    firestore.collection('users').doc(authId).get().then((user) => {
      userRole = user.data().type;
      dispatch({ type: actionTypes.RETRIEVE_USER, userRole, isAuthenticated: true });
    });
  } else {
    dispatch({ type: actionTypes.RETRIEVE_USER, userRole, isAuthenticated: false });
  }
};
