import dbConnect from "@/app/lib/mongo/mongo";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, context) {
	const { params } = context;
	await dbConnect();

	try {
		const product = await Product.findById(params.productId);
		return new NextResponse(JSON.stringify(product), { status: 200 });
	} catch (error) {
		return new Response(error, { status: 500 });
	}
}
