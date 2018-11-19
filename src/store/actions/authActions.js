import { push } from 'connected-react-router'

export const logIn = credentials => (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  firebase.auth().signInWithEmailAndPassword(
    credentials.email,
    credentials.password,
  ).then(() => {
    dispatch({ type: 'LOGIN_SUCCESS' });
    dispatch(push('/'))
  }).catch((err) => {
    dispatch({ type: 'LOGIN_ERROR', err });
  });
};


export const logOut = () => ((dispatch, getstate, { getFirebase }) => {
  const firebase = getFirebase();
  firebase.auth().signOut().then(() => {
    dispatch({ type: 'LOGOUT_SUCCESS' });
    dispatch(push('/'))
  });
});

export const signUp = newUser => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  firebase.auth().createUserWithEmailAndPassword(
    newUser.email,
    newUser.password,
  ).then(resp => firestore.collection('users').doc(resp.user.uid).set({
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    initials: newUser.firstName[0] + newUser.lastName[0],
    mobile: newUser.mobile,
  })).then(() => {
    dispatch({ type: 'SIGNUP_SUCCESS' });
  })
    .catch((err) => {
      dispatch({ type: 'SIGNUP_ERROR', err });
    });
};

export const retrieveUser = auth => (dispatch,getState,{ getFirestore }) => {
  const firestore = getFirestore();
  firestore.collection('users').doc(auth).get().then((user) => {
    const userrole = user.data().role
    dispatch({ type: 'RETRIEVE_USER', user: userrole })
  })
};
