import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function makeHotel() {
    const hotelData = {
        name: faker.name.firstName(),
        image: faker.image.image(),
        updatedAt: new Date(),
        createdAt: new Date(),
    };

    //const Rooms = {
    //    id: faker.id,
    //    name: faker.name,
    //    capacity: faker.capacity,
    //    hotelId: faker.hotelId,
    //    updatedAt: new Date(),
    //    createdAt: new Date(),
    //}

    const newHotel = await prisma.hotel.create({
        data: hotelData,
    });

    //const hotelWithRooms = await prisma.hotel.create({
    //    data: hotelData,
    //});

    return newHotel;
}