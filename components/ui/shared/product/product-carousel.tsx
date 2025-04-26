"use client";

import { Product } from "@/types";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../carousel";
import { Button } from "../../button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import AutoPlay from "embla-carousel-autoplay";
import Link from "next/link";

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
    <Carousel
      className="w-full mb-12"
      opts={{
        loop: true,
      }}
      plugins={[
        AutoPlay({
          delay: 2000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map(
          (product: Product) =>
            product.banner && (
              <CarouselItem key={product.id}>
                <Link href={`/product/${product.slug}`}>
                  <div className="relative mx-auto">
                    <Image
                      src={product.banner}
                      alt={product.name}
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 flex items-end justify-center">
                      <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                        {product.name}
                      </h2>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            )
        )}
      </CarouselContent>
      <CarouselNext />
      <CarouselPrevious />
    </Carousel>
  );
};

export default ProductCarousel;
