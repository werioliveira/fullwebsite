import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

export const POST = async (req) => {



    const {data} = await req.json()
    const paymentId = data.id
    try {
      const response = await fetch('https://api.mercadopago.com/v1/payments/'+paymentId,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
      })
      if(response.ok){
        //const data = await response.json()
        const {status, status_detail, id} = response.json()
        try {
          await Order.findOneAndUpdate({order_id_payment: id}, status)

        } catch (error) {
          return new NextResponse(
            JSON.stringify({ data }),
            { status: 500 }
          );
        }
        return new NextResponse(
          JSON.stringify({ data }),
          { status: 200 }
        );
      }

    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error }),
        { status: 500 }
      );
    }
    
}