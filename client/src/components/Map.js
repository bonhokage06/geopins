import React, { useState, useEffect, useContext } from "react";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import ReactMapGl, { NavigationControl, Marker, Popup } from "react-map-gl";
import differentInMinutes from "date-fns/difference_in_minutes";
import { withStyles } from "@material-ui/core/styles";
import PinIcon from "./PinIcon";
import Blog from "./Blog";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import { Subscription } from "react-apollo";
import Context from "../context";
import { useClient } from "../client";
import { GET_PINS_QUERY } from "../graphql/queries";
import { DELETE_PIN_MUTATION } from "../graphql/mutations";
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION
} from "../graphql/subscriptions";
const initial_viewport = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 8
};
const Map = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width:650px)");
  const [viewport, setViewport] = useState(initial_viewport);
  const [userPosition, setUserPosition] = useState(null);
  const [popup, setPopUp] = useState(null);
  const { state, dispatch } = useContext(Context);
  const client = useClient();
  useEffect(() => {
    getUserPosition();
  }, []);
  useEffect(() => {
    getPins();
  }, []);
  const getPins = async () => {
    const { data } = await client.query({ query: GET_PINS_QUERY });
    dispatch({ type: "GET_PINS", payload: data.getPins });
  };
  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };
  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    dispatch({ type: "CREATE_DRAFT" });
    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: {
        longitude,
        latitude
      }
    });
  };
  const highlightNewPin = pin => {
    const isNewPin =
      differentInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
    return isNewPin ? "limegreen" : "darkblue";
  };
  const handleSelectPin = pin => {
    setPopUp(pin);
    dispatch({ type: "SET_PIN", payload: pin });
  };
  const isAuthorUser = () => state.currentUser._id === popup.author._id;
  const handleDeletePin = async pin => {
    const variables = { id: pin._id };
    await client.mutate({ mutation: DELETE_PIN_MUTATION, variables });
    setPopUp(null);
  };
  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <ReactMapGl
        mapboxApiAccessToken="pk.eyJ1IjoiYm9uaG9rYWdlMDYiLCJhIjoiY2p1ZjlsZW81MGIyNjQ0b2VxbHlqend3ayJ9.peJAMAJss8Hd7ZSnwtvlHw"
        width={"100vw"}
        height={"90vh"}
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onViewportChange={newViewPort => {
          setViewport(newViewPort);
        }}
        onClick={handleMapClick}
        scrollZoom={!mobileSize}
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewPort => {
              setViewport(newViewPort);
            }}
          />
        </div>
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetRight={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}
        {state.draft !== null && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetRight={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}
        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetRight={-37}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              size={40}
              color={highlightNewPin(pin)}
            />
          </Marker>
        ))}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => {
              setPopUp(null);
              dispatch({ type: "UNSELECT_PIN" });
            }}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)},{popup.longitude.toFixed(6)}
              </Typography>
              {isAuthorUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon classes={classes.DeleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGl>
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          dispatch({ type: "CREATE_PIN", payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          dispatch({ type: "CREATE_COMMENT", payload: pinUpdated });
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          dispatch({ type: "DELETE_PIN", payload: pinDeleted });
          const willDeleteCurrentPopUp =
            state.currentPin === null ||
            pinDeleted._id === state.currentPin._id;
          if (willDeleteCurrentPopUp) {
            setPopUp(null);
          }
        }}
      />
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
