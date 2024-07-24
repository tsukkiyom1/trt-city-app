import { PrismaClient } from "@prisma/client";

export const POST = async (request: Request) => {
  const data = await request.json();

  try {
    const prisma = await new PrismaClient();

    await prisma.submission.create({
      data: {
        Name: data.name,
        Surname: data.surname,
        Email: data.email,
        PhoneNumber: data.phoneNumber,
        CityId: data.cityId,
        DistrictId: data.districtId,
      },
    });
  } catch (error) {}

  return Response.json(JSON.stringify(data));
};
