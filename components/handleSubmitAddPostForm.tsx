"use server";

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handleSubmit(title:string, content:string) {
  if (!title || !content) { console.log('Please fill in all the fields'); return; }

  const send = await prisma.post.create({
    data: {
      title,
      content
    }
  });

  if (send) {
    console.log('Post added successfully');
  }

}
