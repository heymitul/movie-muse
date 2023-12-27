import React, { createContext, Fragment, useEffect, useState } from 'react';

import { auth } from '../firebase';
import { Loader } from '../components/index';
import { UsersService, Utils } from '../services';
import { useLocation, useNavigate } from 'react-router';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const AuthContext = createContext({
  currentUser: null,
  authPending: true,
  error: null,
  authenticateUser: async (data) => {
  },
  logoutUser: () => {
  },
  toggleError: (message = null, type = null) => {
  }
});

const AuthContextProvider = (props) => {
  const [ currentUser, setCurrentUser ] = useState(null);
  const [ authPending, setAuthPending ] = useState(true);
  const [ error, setError ] = useState(null);

  const history = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      console.log({
        user
      });
      if (user) {
        const lastVisitedPage = localStorage.getItem('lastVisitedPage');
        if (lastVisitedPage === '/login') {
          await Utils.sleep(500);
        }

        const userInfo = {
          id: user.uid,
          email: user.email
        };

        setCurrentUser({ ...userInfo });
        setAuthPending(false);

        const pages = [ '/login' ];
        if (pages.indexOf(location.pathname) > 0) {
          history('/');
        }
      } else {
        setCurrentUser(null);
        setAuthPending(false);

        localStorage.setItem('lastVisitedPage', location.pathname);

        const pages = [ '/register' ];
        if (pages.indexOf(location.pathname) > 0) {
          history('/login');
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const pagesToIgnoreLoader = [ '/register', '/login' ];
  if (authPending && pagesToIgnoreLoader.indexOf(location.pathname) < 0) {
    return (
        <Fragment>
          <div className='absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 '>
            <Loader className='border-blue-400'/>
          </div>
        </Fragment>
    );
  }

  const authenticateUser = async (data) => {
    try {
      setAuthPending(true);

      let response;

      const {
        name,
        email,
        password,
        repeatPassword
      } = data;

      let isValid = true;
      let message, type;
      if (data?.register && !name) {
        isValid = false;
        message = 'Enter name';
        type = 'NAME';
      } else if (!email || !EMAIL_REGEX.test(email)) {
        isValid = false;
        message = 'Enter valid email';
        type = 'EMAIL';
      } else if (!password) {
        isValid = false;
        message = 'Enter valid password';
        type = 'PASSWORD';
      } else if (data?.register && !repeatPassword) {
        isValid = false;
        message = 'Enter valid password';
        type = 'REPEAT_PASSWORD';
      } else if (data?.register && repeatPassword !== password) {
        isValid = false;
        message = 'Passwords are not matched';
        type = 'REPEAT_PASSWORD';
      }

      if (!isValid) {
        setError({ message, type });
        setAuthPending(false);

        return false;
      }

      if (data?.register) {
        response = await auth.createUserWithEmailAndPassword(email, password);

        const userInfo = {
          userId: response.user.uid,
          email: data.email,
          name: data.name
        };

        await UsersService.createUser(userInfo);

        setCurrentUser({ ...userInfo });
        setAuthPending(false);
        history('/');

        return true;
      }

      await auth.signInWithEmailAndPassword(email, password);

      setAuthPending(false);
      history('/');

      return true;
    } catch (error) {
      let message = error.message;

      let type = '';
      if (message.indexOf('auth/email-already-in-use') > -1) {
        message = 'Account with given email already exists.';
        type = 'COMMON';
      } else if (message.indexOf('auth/user-not-found') > -1) {
        message = 'User not found';
        type = 'COMMON';
      } else if (message.indexOf('auth/invalid-email') > -1) {
        message = 'Enter valid email';
        type = 'EMAIL';
      } else if (message.indexOf('auth/weak-password') > -1) {
        message = 'The password is weak.';
        type = 'PASSWORD';
      } else if (message.indexOf('auth/wrong-password') > -1 || message.indexOf('auth/missing-password')) {
        message = 'The password is invalid.';
        type = 'PASSWORD';
      }

      setError({ message, type });
      setAuthPending(false);

      return false;
    }
  };

  const logoutUser = async () => {
    await auth.signOut();
  };

  const toggleError = (message, type) => {
    setError({ message, type });
  };

  return (
      <AuthContext.Provider value={{
        currentUser,
        authPending,
        error,
        toggleError,
        authenticateUser,
        logoutUser
      }}>
        {props.children}
      </AuthContext.Provider>
  );
};

export default AuthContextProvider;