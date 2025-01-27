import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupOwner: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          v
        );
      },
      message: "Invalid UUID format for groupOwner",
    },
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
