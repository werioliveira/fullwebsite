import dbConnect from "@/app/lib/mongo/mongo";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";
import { generateFakeProducts } from "@/app/lib/generateFakerProducts";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


export async function GET(req, res) {

	const categories = req.nextUrl.searchParams.get("categories");
	const subcategories = req.nextUrl.searchParams.get("subcategories")
	const colors = req.nextUrl.searchParams.get("colors")
	const sizes = req.nextUrl.searchParams.get("sizes")
	const prices = req.nextUrl.searchParams.get("sort")
	const page = parseInt(req.nextUrl.searchParams.get("page")) || 1

	let filter = {};
	let sort = {}

	if (categories) {
	  filter.categories = { $in: categories.split(',') };
	}
  
	if (subcategories) {
	  filter.subcategories = { $in: subcategories.split(',') };
	}
  
	if (colors) {
	  filter['colors.text'] = { $in: colors.split(',') };
	}
	if(prices) {
		if(prices != "newest"){
			prices == "price low" ? sort = {"price": "asc"} : sort = {"price":"desc"}
		}else{
			sort = {"updatedAt": -1}
		}
	}
  
	if (sizes) {
		const sizesArray = sizes.split(',').map(size => new RegExp(size, 'i'));
		filter['sizes.text'] = { $in: sizesArray };
	}
	const limit = parseInt(process.env.NEXT_PUBLIC_ORDERS_PER_PAGE || 10);
	const skip = (page - 1) * limit;
	// Adicione outros filtros conforme necessário

	try {


		let products = []
		let itemCount = 0

		if (Object.keys(filter).length > 0) {
			// Consulta com filtros
			products = await Product.find(filter).skip(skip).limit(limit).sort(sort)
			itemCount = await Product.countDocuments(filter);
		} else {
			// Consulta sem filtros
			products = await Product.find().skip(skip).limit(limit).sort(sort);
			itemCount = await Product.countDocuments({})
		}

		return new NextResponse(JSON.stringify({products, itemCount, currentPage: page, totalPages: Math.ceil(itemCount/limit)}), { status: 200, headers: { 'Content-Type': 'application/json' } });

	} catch (error) {
		return new Response(error, { status: 500 });
	}
}
export async function POST(req) {
	const session = await getServerSession(authOptions);
	const body = await req.json();
	if(session){
		try {
			if(session?.user?.role == "admin"){
				await dbConnect();
				try {
					const product = await Product.create(body);
					return new Response(product, { status: 201 });
				} catch (error) {
					return new Response(error, { status: 500 });
				}
			}
		} catch (error) {
			return new NextResponse(
				JSON.stringify({ message: "Something went wrong!" }),
				{ status: 500 },
			);
		}
	}else {
		return new NextResponse(
			JSON.stringify({ message: "You are not authenticated!" }),
			{ status: 401 },
		);
	}

	
	/*
	//GENERATE FAKE DATA
	const fakeData = generateFakeProducts(500)
*/
//const fakeData = generateFakeProducts(2)

	
}
