/**
 * Middleware untuk menangani error.
 * Error yang dilempar (thrown) di endpoint atau middleware lain akan ditangkap di sini.
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Log error for debugging
    console.error(err.stack);

    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export default errorHandler;
