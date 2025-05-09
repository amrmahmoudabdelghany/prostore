import { auth } from "@/auth";
import { Metadata } from "next";
import React from "react";
import PaymentMethodForm from "./payment-method-form";
import { getUserById } from "@/lib/actions/user.actions";
import CheckoutSteps from "@/components/ui/shared/checkout-steps";

export const metadata: Metadata = {
  title: "Select Payment Method",
};
const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const user = await getUserById(userId);

  return (
    <div>
      PaymentMethodPage
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </div>
  );
};

export default PaymentMethodPage;
