import dbConnect from "@/app/lib/mongo/mongo";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, res) {
	await dbConnect();

	try {
		const products = await Product.find();
		return new NextResponse(JSON.stringify(products), { status: 200 });
	} catch (error) {
		return new Response(error, { status: 500 });
	}
}
export async function POST(req, res) {
	const body = await req.json();

	await dbConnect();
	try {
		const product = await Product.create(body);
		return new Response(product, { status: 201 });
	} catch (error) {
		return new Response(error, { status: 500 });
	}
}
