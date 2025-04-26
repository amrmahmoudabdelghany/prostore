"use server";
import { z } from "zod";
import { insertReviewSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();

    if (!session) throw new Error("User is not authenticated");

    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user.id,
    });

    const product = await prisma.product.findFirst({
      where: {
        id: review.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const existsReview = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: session?.user.id,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (existsReview) {
        await tx.review.update({
          where: {
            id: existsReview.id,
          },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        await tx.review.create({
          data: {
            ...review,
          },
        });
      }
      const avg = await tx.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          productId: product.id,
        },
      });

      const reviewCount = await tx.review.count({
        where: {
          productId: product.id,
        },
      });

      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          rating: avg._avg.rating || 0,
          numReviews: reviewCount,
        },
      });
    });
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Review has been submitted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getAllReviewsByProductId(productId: string) {
  const data = await prisma.review.findMany({
    where: {
      productId: productId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
}

export async function getReviewByProductId(productId: string) {
  const session = await auth();

  if (!session) throw new Error("User is not authenticated");

  return prisma.review.findFirst({
    where: {
      productId: productId,
      userId: session?.user.id,
    },
  });
}
