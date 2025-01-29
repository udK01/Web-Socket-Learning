import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    default: null,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nickname: {
    type: String,
    default: "Anonymous",
  },
  profilePicture: {
    type: String,
    default: "base.png",
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null,
  },
  message: {
    type: String,
    default: "",
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
