export const logIn = credentials => (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  firebase.auth().signInWithEmailAndPassword(
    credentials.email,
    credentials.password,
  ).then(() => {
    const user = firebase.auth().currentUser;
    if (user != null) {
      // User is signed in.
      if (user.emailVerified) {
        dispatch({ type: 'LOGIN_SUCCESS' });
      } else {
        dispatch({ type: 'LOGIN_ERROR', err: 'Email not Verified' });
        dispatch(logOut());
      }
    }
  }).catch((err) => {
    dispatch({ type: 'LOGIN_ERROR', err });
  });
};


export const logOut = () => ((dispatch, getstate, { getFirebase }) => {
  const firebase = getFirebase();

  firebase.auth().signOut().then(() => {
    dispatch({ type: 'LOGOUT_SUCCESS' });
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
    const user = firebase.auth().currentUser;
    if (user != null) {
      user.sendEmailVerification().then(() => {
        // Email sent.
        dispatch({ type: 'SIGNUP_SUCCESS' });
      }).catch((err) => {
        // An error happened.
        dispatch({ type: 'SIGNUP_ERROR', err });
      });
    }
  })
    .then(() => {
      dispatch(logOut());
    })
    .catch((err) => {
      dispatch({ type: 'SIGNUP_ERROR', err });
    });
};