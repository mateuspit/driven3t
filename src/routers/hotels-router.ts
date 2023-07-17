import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
//import { getPaymentByTicketId, paymentProcess } from '@/controllers';
import { getAllHotels } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken)
    .get('/', getAllHotels)
//.post('/process', paymentProcess);

export { hotelsRouter };
