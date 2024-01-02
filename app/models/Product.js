import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 60,
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    img: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sizes: {
      type: [
        {
          text: {
            type: String,
          },
          price: {
            type: Number,
          },
        },
      ],
    },
    colors: {
      type: [
        {
          text: { type: String },
          price: {
            type: Number,
          },
        },
      ],
    },
    categories: [{ type: String }],
    subcategories: [{ type: String }],

    inStock: {
      type: Boolean,
    },
    quantity: {
      type: Number,
    },
    /*
		extraOptions: {
			type: [
				{
					text: {
						type: String,
						required: true,
					},
					price: {
						type: Number,
						required: true,
					},
				},
			],
		},
		*/
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
