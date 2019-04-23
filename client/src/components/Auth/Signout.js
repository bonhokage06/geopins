import React, { useContext } from "react";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import Context from "../../context";
import { useAuth } from "../../client";
const Signout = ({ classes }) => {
  const isMobileSize = useMediaQuery("(max-width:650px)");
  const { dispatch } = useContext(Context);
  const lock = useAuth();
  const onSignOut = () => {
    sessionStorage.removeItem("accessToken");
    lock.logout();
    // dispatch({ type: "SIGNOUT_USER" });
  };
  return (
    <span className={classes.root} onClick={onSignOut}>
      <Typography
        style={{ display: isMobileSize ? "none" : "block" }}
        variant="body1"
        className={classes.buttonText}
      >
        Signout
      </Typography>
      <ExitToAppIcon className={classes.buttonIcon} />
    </span>
  );
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    color: "orange"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange"
  }
};

export default withStyles(styles)(Signout);
