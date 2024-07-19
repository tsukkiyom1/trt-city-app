import { PrismaClient } from "@prisma/client";

export const GET = async () => {
  const prisma = new PrismaClient();

  const cities: any[] = await prisma.city.findMany({
    include: {
      Districts: {
        select: { Id: true, Name: true },
      },
    },
  });

  await prisma.$disconnect();

  const turkishSort = (a: any, b: any) => {
    return a.Name.localeCompare(b.Name, 'tr', { sensitivity: 'base' });
  };

  // şehir ve ilçelerini alfabetik sıralama
  cities.sort(turkishSort);
  cities.forEach((city: any) => {
    city.Districts.sort(turkishSort);
  });

  return new Response(JSON.stringify(cities));
};
