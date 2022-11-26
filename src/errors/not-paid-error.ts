import { ApplicationError } from "@/protocols";

export function paymentError(): ApplicationError {
  console.log("entrei error");
  return {
    name: "PaymentError",
    message: "You must pay the hotel",
  };
}
