import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

// FETCH ALL ORDERS
export const GET = async (req) => {
  const session = await getServerSession(authOptions);

  if (session) {
    try {
      if (session.user.role == "admin") {
        const orders = await Order.find();
        return new NextResponse(JSON.stringify(orders), { status: 200 });
      }
      const orders = await Order.find({ email: session.user.email });
      return new NextResponse(JSON.stringify(orders), { status: 200 });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({ message: "You are not authenticated!" }),
      { status: 401 }
    );
  }
};

export const POST = async (req) => {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const body = await req.json();
      const order = await Order.create({
        email: body.email,
        totalPrice: body.totalPrice,
        products: body.products,
        status: body.status,
        order_id_paypal: body.order_id_paypal,
      });
      return new NextResponse(JSON.stringify(order), { status: 201 });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({ message: "You are not authenticated!" }),
      { status: 401 }
    );
  }
};
