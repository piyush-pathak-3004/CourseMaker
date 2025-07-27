import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { useAuth0 } from '@auth0/auth0-react';

const App = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Router>
      <div>
        <header style={{ display: 'flex', justifyContent: 'flex-end', gap: '1em', padding: '1em' }}>
          {!isAuthenticated ? (
            <button onClick={() => loginWithRedirect()}>Log In</button>
          ) : (
            <>
              <span>Welcome, {user?.name}</span>
              <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log Out
              </button>
            </>
          )}
        </header>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home />
              ) : (
                <div>
                  <h2>Please log in to access the course maker.</h2>
                  <button onClick={() => loginWithRedirect()}>Log In</button>
                </div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;