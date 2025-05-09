"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

import { formatCurrency, formatDateTime, formatUUID } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React, { useTransition } from "react";
import {
  approvePaypalOrder,
  createPayPalOrder,
  deliverOrder,
  updateOrderToPaidCOD,
} from "@/lib/actions/order.actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import StripePayment from "./stripe-payment";

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Omit<Order, "paymentResult">;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  async function handleCreatePayPalOrder() {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast.error("Invalid Order", {
        description: res.message,
      });
    }

    return res.data;
  }

  async function handleApprovePayPalOrder(data: { orderID: string }) {
    const res = await approvePaypalOrder(order.id, data);

    if (!res.success) {
      toast.error("Invalid Order Approval", {
        description: res.message,
      });
    } else {
      toast.success("Success", {
        description: res.message,
      });
    }
  }

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";

    if (isPending) {
      status = "Loading PayPal...";
    } else if (isRejected) {
      status = "Error Loading PayPal";
    }

    return status;
  };

  const MarkAsPaidButton = () => {
    const [isPending, startTransation] = useTransition();

    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransation(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            if (!res.success) {
              toast.error("UPDATE FAILD", {
                description: res.message,
              });
            } else {
              toast.success("UPDATE SUCCESS", {
                description: res.message,
              });
            }
          });
        }}
      >
        {isPending ? "Processing" : "Mark As Paid"}
      </Button>
    );
  };

  const MarkAsDeliveredButton = () => {
    const [isPending, startTransation] = useTransition();

    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransation(async () => {
            const res = await deliverOrder(order.id);
            if (!res.success) {
              toast.error("UPDATE FAILD", {
                description: res.message,
              });
            } else {
              toast.success("UPDATE SUCCESS", {
                description: res.message,
              });
            }
          });
        }}
      >
        {isPending ? "Processing" : "Mark As Delivered"}
      </Button>
    );
  };
  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatUUID(id)}</h1>
      <div className="grid gap-2 md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p className="mb-2">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(paidAt!).dateTime}{" "}
                </Badge>
              ) : (
                <Badge variant="destructive"> Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="my-2">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p className="mb-2">
                {shippingAddress.streetAddress}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode} , {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant="secondary">
                  Delivered at {formatDateTime(deliveredAt!).dateTime}{" "}
                </Badge>
              ) : (
                <Badge variant="destructive"> Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            width={50}
                            height={50}
                            alt={item.name}
                          />
                          <span className="px-2">{item.name} </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell>${item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {!isPaid &&
                paymentMethod == "Stripe" &&
                stripeClientSecret !== null && (
                  <div>
                    <StripePayment
                      orderId={order.id}
                      clientSecret={stripeClientSecret}
                      priceInCents={Number(order.totalPrice) * 100}
                    />
                  </div>
                )}
              {!isPaid && paymentMethod === "PayPal" && (
                <div>
                  <PayPalScriptProvider
                    options={{
                      clientId: paypalClientId,
                    }}
                  >
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
              {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
