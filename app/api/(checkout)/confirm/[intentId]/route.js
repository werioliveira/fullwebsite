import Order from "@/app/models/Order";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// CHANGE THE STATUS OF AN intent
export const PUT = async (req, { params }) => {
  const { intentId } = params;
  try {
    await Order.findOneAndUpdate(
      { order_id_paypal: intentId },
      { status: "Payment Confirmed" }
    );
    return new NextResponse(
      JSON.stringify({ message: "Order has been updated!" }),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
