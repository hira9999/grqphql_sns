import { commentsResolvers } from "./comments.js";
import { postsResolvers } from "./posts.js";
import { usersResolvers } from "./users.js";

export const resolvers = {
  Query: {
    ...usersResolvers.Query,
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Post: {
    commentCount: (post) => {
      console.log(post);
      return post.comments.length;
    },
    likeCount: (post) => {
      console.log(post);
      return post.likes.length;
    },
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
