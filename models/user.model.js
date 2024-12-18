import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      index: true,
    },
    avatar: {
      type: String,
      // required:true
    },
    isAdmin: {
      type: Number,
      required: true,
      index: true,
      default: 0,
    },
    isVerified: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export { User };
