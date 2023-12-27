import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Routes } from 'react-router';
import { Layout } from './components';
import { Home, Login, Register } from './pages';
import PrivateRoute from './PrivateRoute';

import AuthProvider from './context/auth.context';

const App = () => {
  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoute/>}>
              <Route element={<Layout/>}>
                <Route index element={<Home/>}/>
              </Route>
            </Route>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
          </Routes>
        </AuthProvider>
      </Router>
  );
};

export default App;
