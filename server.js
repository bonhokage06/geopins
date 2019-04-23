require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { findOrCreateUser } = require("./controllers/UserController");
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("db connected");
  })
  .catch(error => {
    console.error(error);
  });
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if (authToken && authToken != null) {
        currentUser = findOrCreateUser(authToken);
      }
    } catch (err) {}
    return { currentUser };
  }
});

server.listen().then(({ url }) => {
  console.log(`server is listening on ${url}`);
});
