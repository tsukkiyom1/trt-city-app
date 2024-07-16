import { PrismaClient } from "@prisma/client";

export const GET = async () => {
  const prisma = new PrismaClient();
  const cities = await prisma.city.findMany({
    orderBy: {
      Name: 'asc',
    },
    include: {
      Districts: {
        select: { Id: true, Name: true },
        orderBy: {
          Name: 'asc',
        },
      },
    },
  });

  await prisma.$disconnect();

  return new Response(JSON.stringify(cities));
};
