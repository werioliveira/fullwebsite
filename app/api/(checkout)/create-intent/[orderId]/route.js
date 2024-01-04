import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (req, { params }) => {
  const { orderId } = params;
  const order = await Order.findById(orderId);

  if (order) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalPrice * 100,
      currency: "brl",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
    await Order.findByIdAndUpdate(orderId, {
      $set: { intent_id: paymentIntent.id },
    });
    return new NextResponse(
      JSON.stringify(
        { clientSecret: paymentIntent.client_secret },
        { status: 200 }
      )
    );
  } else {
    return new NextResponse(JSON.stringify({ message: "Order not found" }), {
      status: 404,
    });
  }
};
