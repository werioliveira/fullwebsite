import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
const acessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

const createPreference = async (req) => {
    const client = new MercadoPagoConfig({ accessToken: acessToken, options: {timeout: 5000, idempotencyKey: 'abc'} });
    const preference = new Preference(client);
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
        console.log(response);
        return NextResponse.json(preferenceId)
    } catch (error) {
        console.log(error);
        return NextResponse.json({error});
    }
}
const createPayment = async (req) =>{
    const body = await req.json()
    
    const client = new MercadoPagoConfig({ accessToken: acessToken, options: {timeout: 5000, idempotencyKey: 'abc'} });
    const payment = new Payment(client);
    const payment_data = {
        token: body.token,
        transaction_amount: parseFloat(body.transaction_amount),
        installments: body.installments,
        payment_method_id: body.payment_method_id,
        issuer_id: body.issuer_id,
        payer: {
          email: body.payer.email,
          identification: {
            type: body.payer.identification.type,
            number: body.payer.identification.number
          }
        }
    }
    const requestOptions = {
        idempotencyKey: 'abc',
    };
    const pay = await payment.create({body: payment_data, requestOptions}).then().catch(console.log)
    //payment.create(payment_data).then(console.log).catch(console.log)
    
  return NextResponse.json({pay});
}
function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export const POST = async (req) => {
    const idempotencyKey = generateRandomString(10)
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
            const response = await preference.create({body: items })
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
                notification_url: 'https://webhook.site/a96a4ccf-8ea6-4eef-b17c-e6d4f87c1839',
                payer: {
                  email: body.payer.email,
                  identification: {
                    type: body.payer.identification.type,
                    number: body.payer.identification.number
                  }
                }
            }
        }

        const requestOptions = {
            idempotencyKey: idempotencyKey,
        };
        const payout = await payment.create({body: payment_data}, requestOptions)
        //const pay = await payment.create({body: payment_data, requestOptions}).then(console.log).catch()
        //payment.create(payment_data).then(console.log).catch(console.log)
        
      return NextResponse.json(payout);
    }

    
}