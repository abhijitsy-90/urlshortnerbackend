const userController = require("../controllers/auth.controller");

module.exports = (fastify) => {
    fastify.post("/api/auth/register", userController.register);
    fastify.post("/api/auth/login", userController.login);
};