//import { notFoundError, unauthorizedError } from '@/errors';
//import { CardPaymentParams, PaymentParams } from '@/protocols';
//import enrollmentRepository from '@/repositories/enrollment-repository';
//import paymentsRepository from '@/repositories/payments-repository';
import hotelsRepository from '@/repositories/hotels-repository';

async function getAllHotelsService() {
    const hotels = await hotelsRepository.getAllHotelsRepository();
    //if (!ticket) throw notFoundError();

    //const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);
    //if (!enrollment) throw notFoundError();

    //if (enrollment.userId !== userId) throw unauthorizedError();
    return hotels;
}

export default { getAllHotelsService };
