const { AppError, errorHandler, notFoundHandler } = require('../../src/utils/errorHandler');

describe('AppError', () => {
    test('errore statusCode 400', () => {
        const error = new AppError('Dati non validi', 400);

        expect(error.message).toBe('Dati non validi');
        expect(error.statusCode).toBe(400);
        expect(error.status).toBe('fail');
        expect(error.isOperational).toBe(true);
    });

    test('errore statusCode 500', () => {
        const error = new AppError('Errore interno', 500);

        expect(error.message).toBe('Errore interno');
        expect(error.statusCode).toBe(500);
        expect(error.status).toBe('error');
        expect(error.isOperational).toBe(true);
    });

    test('status "fail"', () => {
        const error401 = new AppError('Non autorizzato', 401);
        const error403 = new AppError('Vietato', 403);
        const error404 = new AppError('Non trovato', 404);

        expect(error401.status).toBe('fail');
        expect(error403.status).toBe('fail');
        expect(error404.status).toBe('fail');
    });

    test('status "fail"', () => {
        const error500 = new AppError('Errore server', 500);
        const error502 = new AppError('Bad gateway', 502);
        const error503 = new AppError('Servizio non disponibile', 503);

        expect(error500.status).toBe('error');
        expect(error502.status).toBe('error');
        expect(error503.status).toBe('error');
    });

    test('istanza di Error', () => {
        const error = new AppError('Test', 400);
        expect(error instanceof Error).toBe(true);
    });
});

describe('errorHandler middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    test('statusCode e messaggio dell\'errore', () => {
        const error = new AppError('Risorsa non trovata', 404);

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'fail',
                message: 'Risorsa non trovata'
            })
        );
    });

    test('dovrebbe usare statusCode 500 come default', () => {
        const error = new Error('Errore generico');

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'error',
                message: 'Errore generico'
            })
        );
    });
});

describe('notFoundHandler middleware', () => {
    test('next ed errore 404', () => {
        const mockReq = { originalUrl: '/api/unknown' };
        const mockRes = {};
        const mockNext = jest.fn();

        notFoundHandler(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 404,
                message: expect.stringContaining('/api/unknown')
            })
        );
    });
});
