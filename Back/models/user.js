import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    default: "Anonymous",
  },
  profilePicture: {
    type: String,
    default: "base.png",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
