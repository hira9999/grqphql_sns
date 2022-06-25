import { User } from "../../models/User.js";
import { UserInputError } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../../utils/validate.js";

const generateToken = async (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      userName: user.userName,
    },
    "secret_key",
    { expiresIn: "24h" }
  );
};

export const usersResolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    login: async (_, { validateLoginInput: { userName, password } }) => {
      const { errors, valid } = validateLoginInput(userName, password);
      const user = await User.findOne({ userName });
      //When the user does not exist
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("Wrong credentials", { errors });
      }
      //When the password is wrong
      const match = bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }
      //validation check
      if (!valid) {
        throw new UserInputError("validation error", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user.id,
        token,
      };
    },

    register: async (
      _,
      { registerInput: { userName, password, ceconfirmPassword, email } },
      context,
      info
    ) => {
      password = await bcrypt.hash(password, 12);
      //validation check
      const { errors, valid } = validateRegisterInput(
        userName,
        password,
        ceconfirmPassword,
        email
      );

      if (!valid) {
        throw new UserInputError("validation error", { errors });
      }
      //When the same user exists
      const user = await User.findOne({ userName });
      if (user) {
        throw new UserInputError("This user already exist", {
          error: {
            userName: "This user already exist",
          },
        });
      }

      const newUser = new User({
        userName,
        password,
        email,
        createAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res.id,
        token,
      };
    },
  },
};
