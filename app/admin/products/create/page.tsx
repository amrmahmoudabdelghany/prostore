import ProductForm from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth-gurd";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Product",
};
const CreateProductPage = async () => {
  await requireAdmin();

  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </>
  );
};

export default CreateProductPage;
