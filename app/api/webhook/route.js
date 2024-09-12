import Order from "@/app/models/Order";
import { NextResponse } from "next/server";
import { headers } from 'next/headers'
import * as crypto from "crypto";

export const POST = async (req) => {
  const {data} = await req.json()
  const paymentId = data.id
  const headersList = headers()
  const xSignature = headersList.get('x-signature')
  const xRequestId = headersList.get('x-request-id')
  const parts = xSignature.split(',')
  let ts;
  let hash;
  
  // Iterate over the values to obtain ts and v1
  parts.forEach(part => {
      // Split each part into key and value
      const [key, value] = part.split('=');
      if (key && value) {
          const trimmedKey = key.trim();
          const trimmedValue = value.trim();
          if (trimmedKey === 'ts') {
              ts = trimmedValue;
          } else if (trimmedKey === 'v1') {
              hash = trimmedValue;
          }
      }
  });
  const secret = process.env.MERCADOPAGO_WEBHOOK_TOKEN;
  const dataID = paymentId
  // Generate the manifest string
  const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
  
  // Create an HMAC signature
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);
  
  // Obtain the hash result as a hexadecimal string
  const sha = hmac.digest('hex');

  if (sha != hash) {
    return new NextResponse(
      JSON.stringify({ error: 'Not authorized by mercado-pago api' }),
      { status: 500 }
    );
  }else{
    try {
      const response = await fetch('https://api.mercadopago.com/v1/payments/'+paymentId,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
      })
      
      if(response.ok){
        const {status, status_detail, id} = await response.json()
        try {
          const orderUpdated = await Order.findOneAndUpdate({order_id_payment: id}, {status: status})
          return new NextResponse(
            JSON.stringify({ orderUpdated }),
            { status: 200 }
          );
        } catch (error) {
          return new NextResponse(
            JSON.stringify({ error }),
            { status: 500 }
          );
        }

      }

    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error }),
        { status: 500 }
      );
    }
  }
    
}