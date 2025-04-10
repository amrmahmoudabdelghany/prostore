//import { Pool, neonConfig } from '@neondatabase/serverless';
//import { PrismaNeon } from '@prisma/adapter-neon';

import { PrismaClient } from "@/lib/generated/prisma";

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient().$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
  },
});
