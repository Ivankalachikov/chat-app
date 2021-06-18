import React, { useState } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import Page404 from './components/Page404.jsx';
import Header from './components/Header.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Chat from './components/Chat.jsx';
import Modals from './components/modals/index.jsx';
import { AuthTokenContext, AuthUsernameContext, SocketInstanceContext } from './context';

const App = ({ socket }) => {
  const token = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');
  const [authToken, setAuthToken] = useState(token);
  const [authUsername, setAuthUsername] = useState(username);

  const AppProviders = ({ children }) => (
    <AuthTokenContext.Provider value={{ authToken, setAuthToken }}>
      <AuthUsernameContext.Provider value={{ authUsername, setAuthUsername }}>
        <SocketInstanceContext.Provider value={socket}>
          {children}
        </SocketInstanceContext.Provider>
      </AuthUsernameContext.Provider>
    </AuthTokenContext.Provider>
  );

  return (
    <AppProviders>
      <div className="d-flex flex-column h-100">
        <Router>
          <Header />
          <Switch>
            <Route exact path="/">
              { authToken ? <Chat /> : <Redirect to="/login" /> }
            </Route>
            <Route exact path="/login">
              {authToken ? <Redirect to="/" /> : <Login />}
            </Route>
            <Route exact path="/signup">
              {authToken ? <Redirect to="/" /> : <Signup />}
            </Route>
            <Route path="*">
              <Page404 />
            </Route>
          </Switch>
          <Modals />
        </Router>
      </div>
    </AppProviders>
  );
};

export default App;
