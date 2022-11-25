import { ApplicationError } from "@/protocols";

export function paymentError(): ApplicationError {
  return {
    name: "PaymentError",
    message: "You must pay the hotel",
  };
}
