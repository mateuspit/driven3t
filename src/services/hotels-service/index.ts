import { notFoundError, unauthorizedError } from '@/errors';
//import { CardPaymentParams, PaymentParams } from '@/protocols';
import enrollmentRepository from '@/repositories/enrollment-repository';
//import paymentsRepository from '@/repositories/payments-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentsService from '@/services/enrollments-service'
import ticketService from '@/services/tickets-service'

async function getAllHotelsService(userId: number) {
    const enrollmentWithAdress = await enrollmentsService.getOneWithAddressByUserId(userId);
    if (!enrollmentWithAdress) throw notFoundError();

    const userTicketId = await ticketService.getTicketByUserId(userId);
    if (!userTicketId) throw notFoundError();

    if (userTicketId.status !== 'PAID') throw Error("PAYMENT_REQUIRED");

    const ticketsTypes = await ticketsRepository.findTicketByEnrollmentId(enrollmentWithAdress.id);
    if (ticketsTypes.TicketType.isRemote === true || ticketsTypes.TicketType.includesHotel === false) {
        throw Error("PAYMENT_REQUIRED");
    }

    const hotels = await hotelsRepository.getAllHotelsRepository();
    if (!hotels[0] || !hotels) throw notFoundError();

    return hotels;
}

async function getHotelsByIdService(hotelId: number, userId: number) {
    if (!hotelId) throw Error('BAD_REQUEST');
    //const hotels = await hotelsRepository.getHotelByIdRepository(hotelId);
    //if (!ticket) throw notFoundError();
    const enrollmentWithAdress = await enrollmentsService.getOneWithAddressByUserId(userId);
    if (!enrollmentWithAdress) throw notFoundError();

    //const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);
    //if (!enrollment) throw notFoundError();
    const userTicketId = await ticketService.getTicketByUserId(userId);
    if (!userTicketId) throw notFoundError();

    if (userTicketId.status !== 'PAID') throw Error("PAYMENT_REQUIRED");

    const ticketsTypes = await ticketsRepository.findTicketByEnrollmentId(enrollmentWithAdress.id);
    if (ticketsTypes.TicketType.isRemote === true || ticketsTypes.TicketType.includesHotel === false) {
        throw Error("PAYMENT_REQUIRED");
    }

    //if (enrollment.userId !== userId) throw unauthorizedError();getHotelsByIdService
    const hotels = await hotelsRepository.getHotelByIdRepository(hotelId);

    if (!hotels) throw notFoundError();

    return hotels;
}

export default { getAllHotelsService, getHotelsByIdService };
