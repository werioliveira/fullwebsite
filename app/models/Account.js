import mongoose from "mongoose";

const { Schema } = mongoose;

const AccountSchema = new Schema({
  id: { type: Schema.ObjectId },
  provider: { type: String, default: "local" },
  type: { type: String, default: "credentials" },
  userId: { type: Schema.ObjectId, ref: "User" },
});

const AccountModel =
  mongoose.models.Account || mongoose.model("Account", AccountSchema);

export default AccountModel;
