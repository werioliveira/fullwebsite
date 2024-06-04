"use client";

import { StatusScreen, initMercadoPago } from "@mercadopago/sdk-react";
import { useSearchParams } from "next/navigation";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,{locale: 'pt-BR'});
  /*

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await fetch(`process.env.NEXT_PUBLIC_APP_BASE_URL/api/confirm/${payment_intent}`, {
          method: "PUT",
        });
        router.push("/orders");
      } catch (error) {
        console.log(error);
      }
    };
    makeRequest();
  }, [payment_intent, router]);
*/
  const initialization = {
    paymentId: paymentId, // id do pagamento a ser mostrado
  };
  const onError = async (error) => {
    // callback chamado para todos os casos de erro do Brick
    console.log(error);
  };
  const onReady = async () => {
    
  };
  return (
<StatusScreen
   initialization={initialization}
   onReady={onReady}
   onError={onError}
/>
  );
};

export default SuccessPage;
