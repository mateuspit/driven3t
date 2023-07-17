import { prisma } from '@/config';
//import { PaymentParams } from '@/protocols';

async function getAllHotelsRepository() {
    return prisma.hotel.findMany();
}

export default { getAllHotelsRepository };
