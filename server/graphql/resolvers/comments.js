import { AuthenticationError, UserInputError } from "apollo-server";
import { Post } from "../../models/Post.js";
import { checkAuth } from "../../utils/checkAuth.js";

export const commentsResolvers = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          error: {
            body: "Comment body must not empty",
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          userName: user.userName,
          createAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },

    deleteComment: async (_, { postId, commentId }, context) => {
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        if (post.comments[commentIndex].userName === user.userName) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
};
