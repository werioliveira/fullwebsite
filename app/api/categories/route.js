
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Categories from "@/app/models/Categories";
import { NextResponse } from "next/server";

// FETCH ALL ORDERS
export const GET = async (req) => {
  try {
    
    const categories = await Categories.find();
    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  const session = await getServerSession(authOptions);
  if (session && session.user?.role == "admin") {
    try {
      const body = await req.json();
      const categorie = await Categories.create({
        category: body.category,
      });
      return new NextResponse(JSON.stringify(categorie), { status: 201 });
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
