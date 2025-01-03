const Fastify = require('fastify');
const cors = require('@fastify/cors');
const db = require('./app/models');
const allowedOrigins = ["http://localhost:5173"];

require('dotenv').config();

const fastify = Fastify();

fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

db.sequelize.sync()
    .then(() => {
        fastify.log.info("Database synced successfully.");
    })
    .catch((err) => {
        fastify.log.error("Failed to sync database:", err.message);
    });

fastify.get('/', async (request, reply) => {
    return { message: "Welcome to the URL shortener application" };
});

fastify.register(require('./app/routes/auth.route'));
fastify.register(require('./app/routes/url.routes'));


fastify.setErrorHandler((error, request, reply) => {
    if (error.message === 'Not allowed by CORS') {
        reply.status(403).send({ error: error.message });
    } else {
        reply.status(error.statusCode || 500).send({ error: error.message });
    }
});


const PORT = process.env.PORT || 8080;
const startServer = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server is running on port ${PORT}.`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();
