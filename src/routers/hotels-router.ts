import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
//import { getPaymentByTicketId, paymentProcess } from '@/controllers';
import { getAllHotels, getHotelById } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken)
    .get('/', getAllHotels)
    .get('/:hotelId', getHotelById)
//.post('/process', paymentProcess);

export { hotelsRouter };
