import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";

import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import { PubSub } from "graphql-subscriptions";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers/index.js";

const app = express();
const httpServer = createServer(app);
const pubsub = new PubSub();

const schema = makeExecutableSchema({ typeDefs, resolvers });
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/",
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
// eslint-disable-next-line react-hooks/rules-of-hooks
const serverCleanup = useServer({ schema }, wsServer);

// ...

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ req, pubsub }),
  csrfPrevention: true,
  cache: "bounded",
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

const PORT = "4000";
mongoose
  .connect(
    "mongodb+srv://hira:ehdrms11@cluster0.sfkqz.mongodb.net/SNS?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(async () => {
    console.log("mongodb connected successfully");
    await server.start();
    server.applyMiddleware({ app });
    httpServer.listen(PORT, () => {
      console.log(
        `Server is now running on http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
