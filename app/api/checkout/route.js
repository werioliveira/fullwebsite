import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const getActiveProducts = async () => {
  const checkProducts = await stripe.products.list();
  const avaliableProducts = checkProducts.data.filter(
    (product) => product.active === true
  );
  return avaliableProducts;
};

export const POST = async (request) => {
  const { products } = await request.json();

  let activeProducts = await getActiveProducts();
  try {
    for (const product of products) {
      const stripeProduct = activeProducts?.find(
        (stripeProduct) =>
          stripeProduct?.name?.toLowerCase() == product?.title?.toLowerCase()
      );
      if (stripeProduct == undefined) {
        const prod = await stripe.products.create({
          name: product.title,
          default_price_data: {
            unit_amount: product.price * 100,
            currency: "brl",
          },
        });
      }
    }
  } catch (error) {
    console.log("error in create", error);
  }
  activeProducts = await getActiveProducts();
  let stripeItems = [];
  for (const product of products) {
    const stripeProduct = activeProducts?.find(
      (prod) => prod?.name?.toLowerCase() == product?.title?.toLowerCase()
    );
    if (stripeProduct) {
      stripeItems.push({
        price: stripeProduct?.default_price,
        quantity: product?.quantity,
      });
    }
  }
  const session = await stripe.checkout.sessions.create({
    line_items: stripeItems,
    mode: "payment",
    success_url: "http://localhost:3000/",
    cancel_url: "http://localhost:3000/cancel",
  });

  return NextResponse.json({ url: session.url });
};
