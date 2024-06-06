import { NextResponse } from "next/server";

export const POST = async (req) => {

  
// Obtain the x-signature value from the header
const xSignature = req.headers['x-signature']; // Assuming headers is an object containing request headers
const xRequestId = req.headers['x-request-id']; // Assuming headers is an object containing request headers

// Obtain Query params related to the request URL
const dataID = req.nextUrl.searchParams.get("data.id")

// Separating the x-signature into parts
const parts = xSignature.split(',');

// Initializing variables to store ts and hash
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

// Obtain the secret key for the user/application from Mercadopago developers site
const secret = process.env.MERCADOPAGO_ACCESS_TOKEN

// Generate the manifest string
const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

// Create an HMAC signature
const hmac = crypto.createHmac('sha256', secret);
hmac.update(manifest);

// Obtain the hash result as a hexadecimal string
const sha = hmac.digest('hex');

if (sha === hash) {
    // HMAC verification passed
    console.log("HMAC verification passed");
} else {
    // HMAC verification failed
    console.log("HMAC verification failed");
}


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