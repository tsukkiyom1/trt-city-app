import { PrismaClient } from "@prisma/client";

export const GET = async () => {
  const prisma = new PrismaClient();
  const cities = await prisma.city.findMany({
    include: { Districts: { select: { Id: true, Name: true } } },
  });

  return new Response(JSON.stringify(cities));
};
