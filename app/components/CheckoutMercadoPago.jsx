//checkoutMercadoPago.tsx
"use client"
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";

initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,{locale: 'pt-BR'});

const CheckoutMercadoPago = ({preferenceId, amount, cart, email}) => {
  const router = useRouter();
  const initialization = {
    amount: amount,
    preferenceId: preferenceId
  };
  const customization = {
    paymentMethods: {
      ticket: "all",
      bankTransfer: "all",
      creditCard: "all",
      debitCard: "all",
      mercadoPago: "all",
    },
  };
  const onSubmit = async ({ selectedPaymentMethod, formData }) => {
   
 // callback chamado ao clicar no botão de submissão dos dados
    return new Promise((resolve, reject) => {
      fetch("/api/process_payment?confirm=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then(async(response) => {
          // receber o resultado do pagamento
            try {
              const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  products: cart,
                  email: formData.payer.email,
                  totalPrice: amount,
                  status: response.status || 'Not Paid',
                  order_id_payment: response.id,
                }),
              });
              const data = await res.json();
              console.log(data);
            } catch (error) {
              console.log(error);
            }
            router.push(`/payment?paymentId=${response.id}`)
          resolve();
        })
        .catch((error) => {
          // lidar com a resposta de erro ao tentar criar o pagamento
          reject();
        });
    });
  };
  const onError = async (error) => {
    // callback chamado para todos os casos de erro do Brick
    console.log(error);
  };
  const onReady = async () => {
    /*
    Callback chamado quando o Brick estiver pronto.
    Aqui você pode ocultar loadings do seu site, por exemplo.
  */
  };

  return (
    <Payment
      initialization={initialization}
      customization={customization}
      onSubmit={onSubmit}
      onReady={onReady}
      onError={onError}
    />
  );
};
export default CheckoutMercadoPago;