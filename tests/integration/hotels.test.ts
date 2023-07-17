import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
    createEnrollmentWithAddress,
    createUser,
    createTicketType,
    makeHotel,
    createTicket,
    createTicketTypeFactory,
    createPayment,
    generateCreditCardData,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
    it('Retorna status 401 ao enviar token inválido', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Retorna status 404 se inscrição não existir', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Retorna status 404 se ticket não existir', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        await createEnrollmentWithAddress(user);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Retorna 402 se ticket não foi pago', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeFactory(true, false);

        await createTicket(enrollment.id, ticketType.id, 'RESERVED');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Retorna 402 se o tipo do ticket for remoto', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeFactory(true, false);

        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Retorna 402 se o tipo do ticket não inclui hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeFactory(true, false);

        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Retorna status 404 se não existir hotéis', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeFactory(false, true);

        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Retorna a lista de hotéis disponíveis no sucesso', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeFactory(false, true);
        //export async function createTicketTypeFactory(isRemote: boolean, includesHotel: boolean) 

        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const hotel = await makeHotel();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        //expect(response.status).toBe(200);

        expect(response.body[0]).toEqual({
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
        });

        expect(response.status).toBe(httpStatus.OK);
    });
});

describe('GET /hotels/:hotelId', () => {
    it('Retorna status 401 ao enviar token inválido', async () => {
        const response = await server.get('/hotels/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Retorna status 404 se inscrição não existir', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Retorna status 404 se ticket não existir', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        await createEnrollmentWithAddress(user);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Retorna status 404 se hotel não existir', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeFactory(false, true);

        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Retorna 402 se ticket não foi pago', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();

        await createTicket(enrollment.id, ticketType.id, 'RESERVED');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Retorna 402 se o tipo do ticket for remoto', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeFactory(true, false);

        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Retorna 402 se o tipo do ticket não inclui hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeFactory(true, false);

        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    //it('Retorna o hotel com a lista de quartos', async () => {
    //    const user = await createUser();
    //    const token = await generateValidToken(user);
    //    const enrollment = await createEnrollmentWithAddress(user);
    //    const ticketType = await createTicketTypeFactory(true, false);

    //    await createTicket(enrollment.id, ticketType.id, 'PAID');

    //    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    //    expect(response.body[0]).toEqual({
    //        id: hotel.id,
    //        name: hotel.name,
    //        image: hotel.image,
    //        createdAt: hotel.createdAt.toISOString(),
    //        updatedAt: hotel.updatedAt.toISOString(),
    //        Rooms: [
    //            {
    //              id: hotelWithRooms.Rooms[0].id,
    //              name: hotelWithRooms.Rooms[0].name,
    //              capacity: hotelWithRooms.Rooms[0].capacity,
    //              hotelId: hotelWithRooms.Rooms[0].hotelId,
    //              createdAt: hotelWithRooms.Rooms[0].createdAt.toISOString(),
    //              updatedAt: hotelWithRooms.Rooms[0].updatedAt.toISOString(),
    //            }
    //          ]
    //    });

    //    expect(response.status).toBe(httpStatus.OK);
    //});
});
