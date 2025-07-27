import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const authConfig = {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
};

ReactDOM.render(
  <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: authConfig.audience
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
