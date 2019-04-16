import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Context from "../../context";
import { ME_QUERY } from "../../graphql/queries";
import { BASE_URL } from "../../client";
const Login = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const onSuccess = async googleUser => {
    try {
      const id_token = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: id_token }
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn() });
    } catch (error) {
      onFailure(error);
    }
  };
  const onFailure = err => {
    console.error(err);
  };
  let contents =
    state !== undefined ? (
      <div className={classes.root}>
        <Typography
          component="h1"
          variant="h3"
          gutterBottom
          noWrap
          style={{ color: "rgb(66,133,244)" }}
        >
          Welcome
        </Typography>
        <GoogleLogin
          clientId="314638193876-t850ljhe43ed2rm4bpkv4kj8lvcgoe7g.apps.googleusercontent.com"
          onSuccess={onSuccess}
          onFailure={onFailure}
          isSignedIn={state.isAuth}
          buttonText="Login with Google"
          theme="dark"
        />
      </div>
    ) : (
      <></>
    );
  return contents;
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
