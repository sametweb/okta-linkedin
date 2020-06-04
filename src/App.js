import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Security, LoginCallback, useOktaAuth } from "@okta/okta-react";

const config = {
  // for okta-react components
  issuer: "https://dev-956984.okta.com/oauth2/default",
  clientId: "0oadqw2003tWfIV3J4x6",
  redirectUri: `${window.location.origin}/implicit/callback`,
  pkce: true,
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
  console.log({ authState, authService });
  authService.getUser().then(console.log);
  const linkedin = {
    url: "https://dev-956984.okta.com/oauth2/v1/authorize",
    idp: "0oadr7cgkERe73AkA4x6",
    clientId: "0oadqw2003tWfIV3J4x6",
    responseType: "id_token token",
    responseMode: "fragment",
    scope: "openid%20profile%20email",
    redirectUri: `${window.location.origin}/implicit/callback`,
    state: "ANYVALUE",
    nonce: "ANYVALUE",
  };
  const {
    url,
    idp,
    clientId,
    responseType,
    responseMode,
    scope,
    redirectUri,
    state,
    nonce,
  } = linkedin;

  const finalUrl = `${url}?idp=${idp}&client_id=${clientId}&response_type=${responseType}&response_mode=${responseMode}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}&nonce=${nonce}`;
  const logout = () => {
    authService.logout("/"); // Redirect to '/' after logout
  };

  if (authState.isPending) {
    return <div>Loading...</div>;
  }

  return authState.isAuthenticated ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <a href={finalUrl}>Login with LinkedIn</a>
  );
};

const Login = (props) => {
  // const token = props.location.hash.split("#id_token=")[1].split("&")[0];
  const { authService, authState } = useOktaAuth();

  useEffect(() => {
    authService.handleAuthentication();
    if (props.location.hash.includes("#id_token")) {
      authService.login("/"); // redirect to '/' after login
    }
  }, []);

  return (
    <div style={{ backgroundColor: "salmon" }}>
      Thank you for logging in... Please wait, we are redirecting you to
      homepage...
      <br />
      <div style={{ display: "none" }}>
        <LoginCallback />
      </div>
    </div>
  );
};

export default App;

// /linkedin.com -> Login ->
// implicit/callback/#id_token=asdasdasdasdasd
// implicit/callback
// /
