
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import SubCategories from "@/app/models/SubCategories";

// FETCH ALL ORDERS
export const GET = async (req) => {
  try {
    const subCategories = await SubCategories.find();
    return new NextResponse(JSON.stringify(subCategories), { status: 200 });
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
      const subcategorie = await SubCategories.create({
        subCategory: body.subCategory,
      });
      return new NextResponse(JSON.stringify(subcategorie), { status: 201 });
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
