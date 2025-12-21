import mongoose from "mongoose";

const methodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    extra: {
      type: String,
      default: "",
      trim: true,
    },
    methods: {
      type: [methodSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
