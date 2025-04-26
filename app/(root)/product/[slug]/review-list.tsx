"use client";

import { Review } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReviewForm from "./review-form";
import { getAllReviewsByProductId } from "@/lib/actions/review.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/ui/shared/product/Rating";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    const loadReviews = async () => {
      const res = await getAllReviewsByProductId(productId);
      setReviews(res.data);
    };
    loadReviews();
  }, [productId]);

  const onReviewSubmitted = async () => {
    const res = await getAllReviewsByProductId(productId);
    setReviews([...res.data]);
  };
  return (
    <div className="space-y-4">
      {reviews.length == 0 && <p>No reviews yet</p>}
      {userId && userId !== "" ? (
        <>
          {/* Reviews Form Here */}
          <ReviewForm
            userId={userId}
            productId={productId}
            onReviewSubmitted={onReviewSubmitted}
          />
        </>
      ) : (
        <div>
          Please{" "}
          <Link
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
            className="px-2 text-blue-700"
          >
            signin
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-4">
        {reviews.length > 0 &&
          reviews.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{r.title}</CardTitle>
                </div>
                <CardDescription>{r.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  {/* RATTING */}
                  <Rating value={r.rating} />
                  <div className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    {r.user ? r.user.name : "Deleted User"}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDateTime(r.createdAt).dateTime}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default ReviewList;
