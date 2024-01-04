import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

// CHANGE THE STATUS OF AN ORDER
export const PUT = async (req, { params }) => {
  const { id } = params;

  try {
    const body = await req.json();

    await Order.findByIdAndUpdate(id, { $set: { status: body.status } });
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
export const DELETE = async (req, { params }) => {
  const { id } = params;
  try {
    await Order.findOneAndDelete({ order_id_paypal: id });
    return new NextResponse(
      JSON.stringify({ message: "Order has been deleted!" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
