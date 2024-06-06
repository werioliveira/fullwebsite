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
        const data = await response.json()
        console.log(data);
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