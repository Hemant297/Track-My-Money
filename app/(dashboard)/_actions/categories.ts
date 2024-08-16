// "use server";

// import prisma from "@/lib/prisma";
// import {
//   CreateCategorySchema,
//   CreateCategorySchemaType,
// } from "@/schema/categories";
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// export async function CreateCategory(form: CreateCategorySchemaType) {
//   const parsedBody = CreateCategorySchema.safeParse(form);
//   if (!parsedBody.success) {
//     throw new Error("bad request");
//   }

//   const user = await currentUser();
//   if (!user) {
//     redirect("/sign-in");
//   }

//   const { name, icon, type } = parsedBody.data;
//   return await prisma.category.create({
//     data: {
//       userId: user.id,
//       name,
//       icon,
//       type,
//     },
//   });
// }
"use server";

import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("Bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;

  try {
    return await prisma.category.create({
      data: {
        userId: user.id,
        name,
        icon,
        type,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Unique constraint violated");
    }
    throw new Error("Failed to create category");
  }
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
}
