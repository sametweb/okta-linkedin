import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Security, LoginCallback, useOktaAuth } from "@okta/okta-react";
import axios from "axios";

const config = {
  issuer: "https://dev-956984.okta.com/oauth2/default",
  clientId: "0oadqw2003tWfIV3J4x6",
  redirectUri: `${window.location}implicit/callback`,
  pkce: false,
  responseType: "id_token",
  responseMode: "fragment",
  scope: ["profile", "email", "openid"],
  state: "ANYVALUE",
  nonce: "ANYVALUE",
};

const App = () => {
  return (
    <Router>
      <Security {...config}>
        <Route path="/" component={Home} />
        <Route path="/implicit/callback" component={Login} />
      </Security>
    </Router>
  );
};

const Home = () => {
  const { authState, authService } = useOktaAuth();

  // console.log({ authService, authState });
  authService.getUser().then((user) => console.log({ user }));

  const login = async () => {
    authService.login("/"); // Redirect to '/' after login
  };

  const logout = async () => {
    authService.logout("/"); // Redirect to '/' after logout
  };

  if (authState.isPending) {
    return <div>Loading...</div>;
  }

  return authState.isAuthenticated ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <>
      <button onClick={login}>Login</button>
      <a
        href={`https://dev-956984.okta.com/oauth2/v1/authorize?idp=0oadr7cgkERe73AkA4x6&client_id=${config.clientId}&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=${window.location}implicit/callback&state=ANYVALUE&nonce=ANYVALUE`}
      >
        Login with LinkedIn
      </a>
    </>
  );
};

const Login = (props) => {
  const token = props.location.hash.split("#id_token=")[1].split("&")[0];

  return (
    <>
      {token}
      <LoginCallback />
    </>
  );
};

export default App;
