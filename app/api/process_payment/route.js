import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';
const acessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

export const POST = async (req) => {
    const idempotencyKey = uuidv4()
    const client = new MercadoPagoConfig({ accessToken: acessToken, options: {timeout: 5000, idempotencyKey: idempotencyKey} });
    const preference = new Preference(client);
    const isCreate = req.nextUrl.searchParams.get("confirm")
    
    if(Boolean(isCreate) == false){

        let preferenceId = ''
        
        const {cart} = await req.json();
        const items = {
            "items": 
            cart.cartItems.map((key)=>({
                "id": key._id,
                "title": key.title,
                "quantity": key.quantity,
                "unit_price":key.price
            }))
        }
    
    // Cria um objeto de preferência
    
        try {
            const response = await preference.create({body: items})
            preferenceId = response.id
            return NextResponse.json(preferenceId)
        } catch (error) {
            console.log(error);
            return NextResponse.json({error});
        }
    }else{
        const body = await req.json()
        const payment = new Payment(client);
        let payment_data = {}
        if(body.payment_method_id == 'pix'){
            payment_data = {
                payment_method_id: 'pix',
                notification_url: process.env.MERCADOPAGO_NOTIFICATION_URL,
                transaction_amount: parseFloat(body.transaction_amount),
                payer: { email: body.payer.email }
            }     
        }
        if(body.payment_method_id == 'boleto'){
            payment_data = {
                token: body.token,
                description: "teste",
                transaction_amount: parseFloat(body.transaction_amount),
                installments: body.installments,
                payment_method_id: body.payment_method_id,
                issuer_id: body.issuer_id,
                payer: {
                    first_name: body.payer.first_name,
                    last_name: body.payer.last_name,
                  email: body.payer.email,
                  identification: {
                    type: body.payer.identification.type,
                    number: body.payer.identification.number
                  }
                }
            }
        } 
            else if (body.payment_method_id == 'master'){
            payment_data = {
                token: body.token,
                description: "teste",
                transaction_amount: parseFloat(body.transaction_amount),
                installments: body.installments,
                payment_method_id: body.payment_method_id,
                issuer_id: body.issuer_id,
                notification_url: process.env.MERCADOPAGO_NOTIFICATION_URL,
                payer: {
                  email: body.payer.email,
                  identification: {
                    type: body.payer.identification.type,
                    number: body.payer.identification.number
                  }
                }
            }
        }


        const paymentResponse = await payment.create({body: payment_data})
        
      return NextResponse.json(paymentResponse);
    }

    
}