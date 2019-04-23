import React, { useContext,useState, useEffect } from "react";
import { createHttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Context from "../../context";
import { ME_QUERY } from "../../graphql/queries";
import { BASE_URL, useAuth } from "../../client";
const Login = ({ classes }) => {
  const [isLoading,setIsLoading]=useState(false);
  const { state, dispatch } = useContext(Context);
  const onSuccess = async () => {
    setIsLoading(true);
    try {
      const id_token = sessionStorage.getItem("accessToken");
      const link = createHttpLink({
        uri: BASE_URL,
        headers: {
          authorization: id_token
        }
      });
      const client = new ApolloClient({
        link: link,
        cache: new InMemoryCache()
      });
      const { data } = await client.query({ query: ME_QUERY });
      dispatch({ type: "LOGIN_USER", payload: data.me });
      dispatch({ type: "IS_LOGGED_IN", payload: true });
    } catch (error) {
      onFailure(error);
    }
    setIsLoading(false);    
  };
  const lock = useAuth(onSuccess);
  const onLogin = () => {
    lock.show();
  };
  const onFailure = err => {
    dispatch({ type: "IS_LOGGED_IN", payload: false });
  };
  let contents =<div className={classes.root}>
        <Typography
          component="h1"
          variant="h3"
          gutterBottom
          noWrap
          style={{ color: "rgb(66,133,244)" }}
        >
          Welcome
        </Typography>
        <Button 
          onClick={onLogin} 
          className={classes.loginButton}
          variant="contained"
          color="primary"> { isLoading ?  "Loading....":<><ExitToApp className={classes.largeIcon}/> Login</>}</Button>
      </div>
  return contents;
};

const styles =theme=> ({
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  loginButton:{
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0 ,
    fontSize: 20,
    marginRight: theme.spacing.unit    
  },
  largeIcon: {
    fontSize: "2em",
    fontColor:'white'     
  },  
});

export default withStyles(styles)(Login);
