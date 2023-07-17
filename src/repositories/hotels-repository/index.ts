import { prisma } from '@/config';
//import { PaymentParams } from '@/protocols';

async function getAllHotelsRepository() {
    return prisma.hotel.findMany();
}

async function getHotelByIdRepository(hotelId: number) {
    const id = hotelId;
    return prisma.hotel.findUnique({
        where: { id },
        include: { Rooms: true }
    });
}

export default { getAllHotelsRepository, getHotelByIdRepository };
