import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
//import paymentsService from '@/services/payments-service';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  try {
    //const ticketId = Number(req.query.ticketId);
    //const { userId } = req;
    //if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);
    //const payment = await paymentsService.getPaymentByTicketId(userId, ticketId);
    //if (!payment) return res.sendStatus(httpStatus.NOT_FOUND);
    const hotels = await hotelsService.getAllHotelsService();

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    //if (error.name === 'UnauthorizedError') {
    //  return res.sendStatus(httpStatus.UNAUTHORIZED);
    //}
    //return res.sendStatus(httpStatus.INOT_FOUND);
  }
}