require("dotenv").config();
var axios = require("axios");
const User = require("../models/User");
exports.findOrCreateUser = async token => {
  //verify auth token
  const AuthUser = await verifyAuthToken(token);
  if (AuthUser) {
    //check if the user exist
    const user = await checkIfUserExits(AuthUser.email);
    //if user exists, return them, otherwise, create new user in db
    return user ? user : createNewUser(AuthUser);
  }
};
const verifyAuthToken = async accessToken => {
  try {
    const res = await axios.get(process.env.AUTH_CLIENT_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    });
    return res.data;
  } catch (error) {
    return;
  }
};
const checkIfUserExits = async email => await User.findOne({ email }).exec();
const createNewUser = AuthUser => {
  const { name, email, picture } = AuthUser;
  const user = {
    name,
    email,
    picture
  };
  return new User(user).save();
};
