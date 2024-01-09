import mongoose from "mongoose";

const { Schema } = mongoose;

const SubCategoriesSchema = new Schema({
  id: { type: Schema.ObjectId },
  subCategory: { type: String, required: true },
});

const SubCategories =
  mongoose.models.SubCategories ||
  mongoose.model("SubCategories", SubCategoriesSchema);

export default SubCategories;
