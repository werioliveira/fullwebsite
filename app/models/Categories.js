import mongoose from "mongoose";

const { Schema } = mongoose;

const CategoriesSchema = new Schema({
  id: { type: Schema.ObjectId },
  category: { type: String, required: true },
});

const Categories =
  mongoose.models.Categories || mongoose.model("Categories", CategoriesSchema);

export default Categories;
