import { PrismaClient } from "@prisma/client";

export const GET = async () => {
  const prisma = new PrismaClient();
  const cities = await prisma.city.findMany();

  return new Response(JSON.stringify(cities));
};
