import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    default: null,
  },
  userID: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          v
        );
      },
      message: "Invalid UUID format for userID",
    },
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
