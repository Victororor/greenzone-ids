// gestione centralizzata degli errori

class AppError extends Error {
    constructor (message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// middleware di gestione errori
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // log in development
    if (process.env.NODE_ENV === 'development') {
        console.error('ERROR:', err);
    }

    // risposta standardizzata
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// handler per route non trovate
const notFoundHandler = (req, res, next) => {
    next(new AppError(`Risorsa non trovata: ${req.originalUrl}`, 404));
};

module.exports = { AppError, errorHandler, notFoundHandler };
