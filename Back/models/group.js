import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupOwner: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100,
  },
  groupImg: {
    type: String,
    default: "./vite.svg",
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
