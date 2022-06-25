import { gql } from "apollo-server";

export const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createAt: String!
    userName: String!
    comments: [Comment]!
    likes: [Like]!
    commentCount: Int!
    likeCount: Int!
  }
  type Comment {
    id: ID!
    createAt: String!
    userName: String!
    body: String!
  }
  type Like {
    id: ID!
    createAt: String!
    userName: String!
  }
  type User {
    id: ID!
    userName: String!
    email: String!
    createAt: String!
    token: String!
  }
  input RegisterInput {
    userName: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  input ValidateLoginInput {
    userName: String!
    password: String!
  }
  type Query {
    getUsers: [User]
    getPosts: [Post]
    getPost(postId: ID!): Post!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(validateLoginInput: ValidateLoginInput): User!
    createPost(body: String!): Post!
    deletePost(postId: String!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
  type Subscription {
    newPost: Post!
  }
`;
