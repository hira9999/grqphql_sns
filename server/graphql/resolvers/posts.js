import { Post } from "../../models/Post.js";
import { checkAuth } from "../../utils/checkAuth.js";
import { AuthenticationError, UserInputError } from "apollo-server";

export const postsResolvers = {
  Query: {
    getPosts: async (_, args, context) => {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      //Error when there is no user
      const user = checkAuth(context);
      if(body.trim()===""){
        throw new Error('Pos body must not be empty')
      }
      const newPost = new Post({
        body,
        id: user.id,  
        userName: user.userName,
        createAt: new Date().toISOString(),
      });
      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },
    deletePost: async (_, { postId }, context) => {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (user.userName === post.userName) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Invalid access");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    likePost: async (_, { postId }, context) => {
      const { userName } = checkAuth(context);
      const post = await Post.findById(postId);

      if (post) {
        const isLiked = post.likes.find((like) => userName === like.userName);

        if (!isLiked) {
          //post Not liked
          post.likes.push({
            userName: userName,
            createAt: new Date().toISOString(),
          });
        } else {
          //already liked
          post.likes = post.likes.filter((like) => like.userName !== userName);
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => {
        pubsub.asyncIterator("NEW_POST");
      },
    },
  },
};
