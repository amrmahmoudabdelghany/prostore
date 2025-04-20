import { getUserById } from "@/lib/actions/user.actions";
import { requireAdmin } from "@/lib/auth-gurd";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import UserUpdateForm from "./user-update-form";

export const metadata: Metadata = {
  title: "Update User",
};

const EditUserPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  await requireAdmin();

  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) {
    return notFound();
  }

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Update User</h1>
      <UserUpdateForm user={user} />
    </div>
  );
};

export default EditUserPage;
