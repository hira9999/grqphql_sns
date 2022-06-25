import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema({
  body: String,
  userName: String,
  createAt: String,
  comments: [
    {
      body: String,
      userName: String,
      createAt: String,
    },
  ],
  likes: [
    {
      userName: String,
      createAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

export const Post = model("Post", postSchema);
