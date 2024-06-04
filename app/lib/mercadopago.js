import { loadMercadoPago } from "@mercadopago/sdk-js";

await loadMercadoPago();
const mp = new window.MercadoPago(process.env.MERCADOPAGO_PUBLIC_KEY, {
  locale: "pt-BR",
});
export default mp