import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
//import paymentsService from '@/services/payments-service';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
    const userId: number = Number(req.userId);
    try {
        const hotels = await hotelsService.getAllHotelsService(userId);

        return res.status(httpStatus.OK).send(hotels);
    } catch (error) {
        if (error.message === 'PAYMENT_REQUIRED') {
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        }
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
    }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
    const hotelId: number = Number(req.params.hotelId);
    const userId: number = Number(req.userId);
    try {
        const hotelById = await hotelsService.getHotelsByIdService(hotelId, userId);

        return res.status(httpStatus.OK).send(hotelById);
    } catch (error) {
        if (error.message === 'PAYMENT_REQUIRED') {
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        }
        if (error.message === 'BAD_REQUEST') {
            return res.sendStatus(httpStatus.BAD_REQUEST);
        }
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}