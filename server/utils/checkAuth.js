import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server";

export const checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, "secret_key");
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid or Expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error("Authentication header must be provieded");
};
