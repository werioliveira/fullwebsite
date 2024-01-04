import { NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_SECRET_ID;

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);

const client = new paypal.core.PayPalHttpClient(environment);

export const POST = async (req) => {
  const { amount, items } = await req.json();

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "BRL",
          value: amount,
          breakdown: {
            item_total: { currency_code: "BRL", value: amount },
          },
        },
      },
    ],
  });
  const response = await client.execute(request);

  return NextResponse.json({ id: response.result.id });
};

/*
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
    shipping_address_collection: {
      allowed_countries: ["BR", "US"],
    },
    consent_collection: {
      terms_of_service: "required",
    },

    custom_text: {
      shipping_address: {
        message:
          "Please note that we can't guarantee 2-day delivery for PO boxes at this time.",
      },
      submit: {
        message: "We'll email you instructions on how to get started.",
      },
      after_submit: {
        message:
          "Learn more about **your purchase** on our [product page](https://www.stripe.com/).",
      },
      terms_of_service_acceptance: {
        message: "I agree to the [Terms of Service](https://example.com/terms)",
      },
    },

    success_url: "http://localhost:3000/",
    cancel_url: "http://localhost:3000/cancel",
  });

  return NextResponse.json({ url: session.url });
};
*/
