import { updateOrderToPaid } from "@/lib/actions/order.actions";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  // Build the webhook event
  const event = await Stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  // check for successful payment
  if (event.type === "charge.succeeded") {
    const { object } = event.data;

    // update order status

    await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: "COMPLETED",
        email_address: object.billing_details.email!,
        pricePaid: (object.amount / 100).toFixed(),
      },
    });

    return Response.json({
      message: "updateOrderToPaid was successful",
    });
  }

  return Response.json({
    message: "event is not charge.succeeded",
  });
}
